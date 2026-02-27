// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenVesting is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint64 start;
        uint64 cliff;
        uint64 duration;
        bool cancelable;
        bool revoked;
    }

    IERC20 public immutable token;
    address public treasury;

    mapping(address => VestingSchedule) public schedules;

    event ScheduleCreated(address indexed beneficiary, uint256 amount, uint64 start, uint64 cliff, uint64 duration, bool cancelable);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event ScheduleRevoked(address indexed beneficiary, uint256 refundAmount);
    event TreasuryUpdated(address indexed treasury);

    error ZeroAddress();
    error ZeroAmount();
    error InvalidSchedule();
    error ScheduleExists();
    error NotCancelable();

    constructor(address admin, IERC20 token_, address treasury_) {
        if (admin == address(0) || address(token_) == address(0) || treasury_ == address(0)) {
            revert ZeroAddress();
        }

        token = token_;
        treasury = treasury_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function createSchedule(
        address beneficiary,
        uint256 amount,
        uint64 start,
        uint64 cliffDuration,
        uint64 duration,
        bool cancelable
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (beneficiary == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }
        if (duration == 0 || cliffDuration > duration) {
            revert InvalidSchedule();
        }
        if (schedules[beneficiary].totalAmount != 0 && !schedules[beneficiary].revoked) {
            revert ScheduleExists();
        }

        uint64 cliff = start + cliffDuration;

        schedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            start: start,
            cliff: cliff,
            duration: duration,
            cancelable: cancelable,
            revoked: false
        });

        token.safeTransferFrom(msg.sender, address(this), amount);

        emit ScheduleCreated(beneficiary, amount, start, cliff, duration, cancelable);
    }

    function releasableAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = schedules[beneficiary];
        if (schedule.totalAmount == 0 || schedule.revoked) {
            return 0;
        }

        uint256 vested = _vestedAmount(schedule, uint64(block.timestamp));
        return vested - schedule.releasedAmount;
    }

    function release() external nonReentrant {
        uint256 amount = releasableAmount(msg.sender);
        if (amount == 0) {
            revert ZeroAmount();
        }

        VestingSchedule storage schedule = schedules[msg.sender];
        schedule.releasedAmount += amount;

        token.safeTransfer(msg.sender, amount);

        emit TokensReleased(msg.sender, amount);
    }

    function revoke(address beneficiary) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (schedule.totalAmount == 0 || schedule.revoked) {
            revert InvalidSchedule();
        }
        if (!schedule.cancelable) {
            revert NotCancelable();
        }

        uint256 vested = _vestedAmount(schedule, uint64(block.timestamp));
        uint256 unreleasedVested = vested - schedule.releasedAmount;
        uint256 refundAmount = schedule.totalAmount - vested;

        schedule.revoked = true;

        if (unreleasedVested > 0) {
            schedule.releasedAmount += unreleasedVested;
            token.safeTransfer(beneficiary, unreleasedVested);
            emit TokensReleased(beneficiary, unreleasedVested);
        }

        if (refundAmount > 0) {
            token.safeTransfer(treasury, refundAmount);
        }

        emit ScheduleRevoked(beneficiary, refundAmount);
    }

    function setTreasury(address treasury_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (treasury_ == address(0)) {
            revert ZeroAddress();
        }

        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }

    function _vestedAmount(VestingSchedule memory schedule, uint64 timestamp) internal pure returns (uint256) {
        if (timestamp < schedule.cliff) {
            return 0;
        }

        uint64 end = schedule.start + schedule.duration;
        if (timestamp >= end) {
            return schedule.totalAmount;
        }

        uint256 elapsed = timestamp - schedule.start;
        return (schedule.totalAmount * elapsed) / schedule.duration;
    }
}
