// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MarketplaceEscrow is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");

    struct Deal {
        address buyer;
        address seller;
        address token;
        uint256 amount;
        uint256 deadline;
        bool released;
        bool disputed;
        bool resolved;
    }

    uint256 public nextDealId;
    mapping(uint256 => Deal) public deals;

    event EscrowCreated(uint256 indexed dealId, address indexed buyer, address indexed seller, address token, uint256 amount);
    event EscrowReleased(uint256 indexed dealId);
    event EscrowRefunded(uint256 indexed dealId);
    event DisputeRaised(uint256 indexed dealId);
    event DisputeResolved(uint256 indexed dealId, uint256 sellerAmount, uint256 buyerAmount);

    error ZeroAddress();
    error ZeroAmount();
    error InvalidAmount();
    error Unauthorized();
    error InvalidState();
    error InvalidDeadline();

    constructor(address admin, address arbiter) {
        if (admin == address(0) || arbiter == address(0)) {
            revert ZeroAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ARBITER_ROLE, arbiter);
    }

    function createEscrow(address seller, address token, uint256 amount, uint256 deadline)
        external
        payable
        nonReentrant
        returns (uint256 dealId)
    {
        if (seller == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }
        if (deadline <= block.timestamp) {
            revert InvalidDeadline();
        }

        if (token == address(0)) {
            if (msg.value != amount) {
                revert InvalidState();
            }
        } else {
            if (msg.value != 0) {
                revert InvalidState();
            }
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        dealId = nextDealId++;
        deals[dealId] = Deal({
            buyer: msg.sender,
            seller: seller,
            token: token,
            amount: amount,
            deadline: deadline,
            released: false,
            disputed: false,
            resolved: false
        });

        emit EscrowCreated(dealId, msg.sender, seller, token, amount);
    }

    function release(uint256 dealId) external nonReentrant {
        Deal storage deal = deals[dealId];
        if (deal.amount == 0 || deal.released || deal.resolved) {
            revert InvalidState();
        }
        if (msg.sender != deal.buyer && !hasRole(ARBITER_ROLE, msg.sender)) {
            revert Unauthorized();
        }

        deal.released = true;

        if (deal.token == address(0)) {
            (bool success,) = payable(deal.seller).call{value: deal.amount}("");
            require(success, "Native transfer failed");
        } else {
            IERC20(deal.token).safeTransfer(deal.seller, deal.amount);
        }

        emit EscrowReleased(dealId);
    }

    function refund(uint256 dealId) external nonReentrant {
        Deal storage deal = deals[dealId];
        if (deal.amount == 0 || deal.released || deal.resolved) {
            revert InvalidState();
        }
        if (msg.sender != deal.seller && !hasRole(ARBITER_ROLE, msg.sender)) {
            revert Unauthorized();
        }
        if (!deal.disputed && block.timestamp <= deal.deadline) {
            revert InvalidState();
        }

        deal.resolved = true;

        if (deal.token == address(0)) {
            (bool success,) = payable(deal.buyer).call{value: deal.amount}("");
            require(success, "Native transfer failed");
        } else {
            IERC20(deal.token).safeTransfer(deal.buyer, deal.amount);
        }

        emit EscrowRefunded(dealId);
    }

    function raiseDispute(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        if (deal.amount == 0 || deal.released || deal.resolved || deal.disputed) {
            revert InvalidState();
        }
        if (msg.sender != deal.buyer && msg.sender != deal.seller) {
            revert Unauthorized();
        }

        deal.disputed = true;
        emit DisputeRaised(dealId);
    }

    function resolveDispute(uint256 dealId, uint256 sellerAmount) external onlyRole(ARBITER_ROLE) nonReentrant {
        Deal storage deal = deals[dealId];
        if (!deal.disputed || deal.released || deal.resolved) {
            revert InvalidState();
        }
        if (sellerAmount > deal.amount) {
            revert InvalidAmount();
        }

        uint256 buyerAmount = deal.amount - sellerAmount;
        deal.resolved = true;

        if (deal.token == address(0)) {
            if (sellerAmount > 0) {
                (bool sellerSuccess,) = payable(deal.seller).call{value: sellerAmount}("");
                require(sellerSuccess, "Native transfer failed");
            }
            if (buyerAmount > 0) {
                (bool buyerSuccess,) = payable(deal.buyer).call{value: buyerAmount}("");
                require(buyerSuccess, "Native transfer failed");
            }
        } else {
            if (sellerAmount > 0) {
                IERC20(deal.token).safeTransfer(deal.seller, sellerAmount);
            }
            if (buyerAmount > 0) {
                IERC20(deal.token).safeTransfer(deal.buyer, buyerAmount);
            }
        }

        emit DisputeResolved(dealId, sellerAmount, buyerAmount);
    }
}
