// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StakingRewards is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant REWARD_DISTRIBUTOR_ROLE = keccak256("REWARD_DISTRIBUTOR_ROLE");

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    uint256 public rewardRate;
    uint256 public rewardsDuration;
    uint256 public periodFinish;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward, uint256 duration);

    error ZeroAddress();
    error ZeroAmount();
    error InvalidDuration();
    error InsufficientBalance();

    constructor(address admin, address distributor, IERC20 stakingToken_, IERC20 rewardsToken_) {
        if (admin == address(0) || distributor == address(0) || address(stakingToken_) == address(0) || address(rewardsToken_) == address(0)) {
            revert ZeroAddress();
        }

        stakingToken = stakingToken_;
        rewardsToken = rewardsToken_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REWARD_DISTRIBUTOR_ROLE, distributor);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }

        return rewardPerTokenStored + (((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / totalSupply);
    }

    function earned(address account) public view returns (uint256) {
        return ((balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) + rewards[account];
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        if (amount == 0) {
            revert ZeroAmount();
        }

        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        if (amount == 0) {
            revert ZeroAmount();
        }
        if (balanceOf[msg.sender] < amount) {
            revert InsufficientBalance();
        }

        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external {
        withdraw(balanceOf[msg.sender]);
        getReward();
    }

    function notifyRewardAmount(uint256 reward, uint256 duration)
        external
        onlyRole(REWARD_DISTRIBUTOR_ROLE)
        updateReward(address(0))
    {
        if (reward == 0) {
            revert ZeroAmount();
        }
        if (duration == 0) {
            revert InvalidDuration();
        }

        rewardsToken.safeTransferFrom(msg.sender, address(this), reward);

        if (block.timestamp >= periodFinish) {
            rewardRate = reward / duration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / duration;
        }

        rewardsDuration = duration;
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;

        emit RewardAdded(reward, duration);
    }
}
