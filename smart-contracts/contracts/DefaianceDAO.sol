// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DefaianceDAO is AccessControl, ReentrancyGuard {
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    enum ProposalState {
        Pending,
        Active,
        Succeeded,
        Defeated,
        Queued,
        Executed,
        Canceled
    }

    struct Proposal {
        address proposer;
        address target;
        uint256 value;
        bytes data;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 eta;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool canceled;
    }

    IVotes public immutable governanceToken;

    uint256 public proposalThreshold;
    uint256 public votingDelayBlocks;
    uint256 public votingPeriodBlocks;
    uint256 public quorumBps;
    uint256 public timelockDelay;

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, address indexed target, uint256 startBlock, uint256 endBlock);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 support, uint256 weight);
    event ProposalQueued(uint256 indexed proposalId, uint256 eta);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event GovernanceParamsUpdated(uint256 proposalThreshold, uint256 votingDelayBlocks, uint256 votingPeriodBlocks, uint256 quorumBps, uint256 timelockDelay);

    error ZeroAddress();
    error InvalidParams();
    error InsufficientVotingPower();
    error InvalidProposal();
    error InvalidState();
    error AlreadyVoted();
    error Unauthorized();

    constructor(
        address admin,
        IVotes governanceToken_,
        uint256 proposalThreshold_,
        uint256 votingDelayBlocks_,
        uint256 votingPeriodBlocks_,
        uint256 quorumBps_,
        uint256 timelockDelay_
    ) {
        if (admin == address(0) || address(governanceToken_) == address(0)) {
            revert ZeroAddress();
        }

        _validateParams(votingPeriodBlocks_, quorumBps_);

        governanceToken = governanceToken_;
        proposalThreshold = proposalThreshold_;
        votingDelayBlocks = votingDelayBlocks_;
        votingPeriodBlocks = votingPeriodBlocks_;
        quorumBps = quorumBps_;
        timelockDelay = timelockDelay_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);
    }

    function propose(address target, uint256 value, bytes calldata data, string calldata description)
        external
        returns (uint256 proposalId)
    {
        if (target == address(0)) {
            revert ZeroAddress();
        }

        uint256 proposerVotes = governanceToken.getPastVotes(msg.sender, block.number - 1);
        if (proposerVotes < proposalThreshold) {
            revert InsufficientVotingPower();
        }

        proposalId = ++proposalCount;
        uint256 startBlock = block.number + votingDelayBlocks;
        uint256 endBlock = startBlock + votingPeriodBlocks;

        proposals[proposalId] = Proposal({
            proposer: msg.sender,
            target: target,
            value: value,
            data: data,
            description: description,
            startBlock: startBlock,
            endBlock: endBlock,
            eta: 0,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            executed: false,
            canceled: false
        });

        emit ProposalCreated(proposalId, msg.sender, target, startBlock, endBlock);
    }

    function castVote(uint256 proposalId, uint8 support) external {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.proposer == address(0)) {
            revert InvalidProposal();
        }
        if (state(proposalId) != ProposalState.Active) {
            revert InvalidState();
        }
        if (hasVoted[proposalId][msg.sender]) {
            revert AlreadyVoted();
        }
        if (support > 2) {
            revert InvalidParams();
        }

        uint256 voterWeight = governanceToken.getPastVotes(msg.sender, proposal.startBlock);
        if (voterWeight == 0) {
            revert InsufficientVotingPower();
        }

        hasVoted[proposalId][msg.sender] = true;

        if (support == 0) {
            proposal.againstVotes += voterWeight;
        } else if (support == 1) {
            proposal.forVotes += voterWeight;
        } else {
            proposal.abstainVotes += voterWeight;
        }

        emit VoteCast(proposalId, msg.sender, support, voterWeight);
    }

    function queue(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        if (state(proposalId) != ProposalState.Succeeded) {
            revert InvalidState();
        }

        proposal.eta = block.timestamp + timelockDelay;
        emit ProposalQueued(proposalId, proposal.eta);
    }

    function execute(uint256 proposalId) external nonReentrant onlyRole(EXECUTOR_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        if (state(proposalId) != ProposalState.Queued) {
            revert InvalidState();
        }
        if (block.timestamp < proposal.eta) {
            revert InvalidState();
        }

        proposal.executed = true;
        (bool ok,) = proposal.target.call{value: proposal.value}(proposal.data);
        require(ok, "Proposal execution failed");

        emit ProposalExecuted(proposalId);
    }

    function cancel(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.proposer == address(0)) {
            revert InvalidProposal();
        }
        if (msg.sender != proposal.proposer && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert Unauthorized();
        }
        if (proposal.executed) {
            revert InvalidState();
        }

        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    function state(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.proposer == address(0)) {
            revert InvalidProposal();
        }

        if (proposal.canceled) {
            return ProposalState.Canceled;
        }
        if (proposal.executed) {
            return ProposalState.Executed;
        }
        if (block.number < proposal.startBlock) {
            return ProposalState.Pending;
        }
        if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        }

        uint256 requiredQuorum = quorum(proposal.startBlock);
        bool hasEnoughVotes = proposal.forVotes + proposal.abstainVotes >= requiredQuorum;
        bool passed = proposal.forVotes > proposal.againstVotes && hasEnoughVotes;

        if (!passed) {
            return ProposalState.Defeated;
        }

        if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        }

        return ProposalState.Queued;
    }

    function quorum(uint256 blockNumber) public view returns (uint256) {
        uint256 totalSupplyAtBlock = governanceToken.getPastTotalSupply(blockNumber);
        return (totalSupplyAtBlock * quorumBps) / 10_000;
    }

    function updateGovernanceParams(
        uint256 proposalThreshold_,
        uint256 votingDelayBlocks_,
        uint256 votingPeriodBlocks_,
        uint256 quorumBps_,
        uint256 timelockDelay_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _validateParams(votingPeriodBlocks_, quorumBps_);

        proposalThreshold = proposalThreshold_;
        votingDelayBlocks = votingDelayBlocks_;
        votingPeriodBlocks = votingPeriodBlocks_;
        quorumBps = quorumBps_;
        timelockDelay = timelockDelay_;

        emit GovernanceParamsUpdated(proposalThreshold_, votingDelayBlocks_, votingPeriodBlocks_, quorumBps_, timelockDelay_);
    }

    function _validateParams(uint256 votingPeriodBlocks_, uint256 quorumBps_) internal pure {
        if (votingPeriodBlocks_ == 0 || quorumBps_ == 0 || quorumBps_ > 10_000) {
            revert InvalidParams();
        }
    }
}
