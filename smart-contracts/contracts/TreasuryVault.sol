// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TreasuryVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");

    event NativeDeposited(address indexed sender, uint256 amount);
    event NativeWithdrawn(address indexed to, uint256 amount);
    event TokenDeposited(address indexed token, address indexed sender, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed to, uint256 amount);

    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance();

    constructor(address admin, address treasurer) {
        if (admin == address(0) || treasurer == address(0)) {
            revert ZeroAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(TREASURER_ROLE, treasurer);
    }

    receive() external payable {
        if (msg.value == 0) {
            revert ZeroAmount();
        }
        emit NativeDeposited(msg.sender, msg.value);
    }

    function depositToken(address token, uint256 amount) external {
        if (token == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit TokenDeposited(token, msg.sender, amount);
    }

    function withdrawToken(address token, address to, uint256 amount)
        external
        onlyRole(TREASURER_ROLE)
        nonReentrant
    {
        if (token == address(0) || to == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }

        IERC20(token).safeTransfer(to, amount);
        emit TokenWithdrawn(token, to, amount);
    }

    function withdrawNative(address payable to, uint256 amount)
        external
        onlyRole(TREASURER_ROLE)
        nonReentrant
    {
        if (to == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }
        if (amount > address(this).balance) {
            revert InsufficientBalance();
        }

        (bool success,) = to.call{value: amount}("");
        require(success, "Native transfer failed");

        emit NativeWithdrawn(to, amount);
    }
}
