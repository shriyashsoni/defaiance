// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract InvestmentPool is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    address public immutable asset;
    string public poolName;
    string public poolSymbol;

    uint256 public totalShares;
    uint256 public accountedAssets;

    mapping(address => uint256) public sharesOf;

    event Deposited(address indexed user, uint256 assets, uint256 sharesMinted);
    event Withdrawn(address indexed user, uint256 assets, uint256 sharesBurned);
    event YieldAdded(address indexed manager, uint256 amount);
    event LossRecorded(address indexed manager, uint256 amount);

    error ZeroAddress();
    error ZeroAmount();
    error InvalidAmount();
    error InsufficientShares();
    error InsufficientAssets();

    constructor(address asset_, address admin, address manager, string memory name_, string memory symbol_) {
        if (admin == address(0) || manager == address(0)) {
            revert ZeroAddress();
        }

        asset = asset_;
        poolName = name_;
        poolSymbol = symbol_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, manager);
    }

    receive() external payable {
        if (asset != address(0)) {
            revert InvalidAmount();
        }
    }

    function deposit(uint256 amount) external payable whenNotPaused nonReentrant returns (uint256 sharesMinted) {
        if (asset == address(0)) {
            amount = msg.value;
        }
        if (amount == 0) {
            revert ZeroAmount();
        }

        if (asset != address(0)) {
            IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        }

        if (totalShares == 0 || accountedAssets == 0) {
            sharesMinted = amount;
        } else {
            sharesMinted = (amount * totalShares) / accountedAssets;
        }

        if (sharesMinted == 0) {
            revert InvalidAmount();
        }

        totalShares += sharesMinted;
        accountedAssets += amount;
        sharesOf[msg.sender] += sharesMinted;

        emit Deposited(msg.sender, amount, sharesMinted);
    }

    function withdraw(uint256 sharesToBurn) external whenNotPaused nonReentrant returns (uint256 assetsReturned) {
        if (sharesToBurn == 0) {
            revert ZeroAmount();
        }
        if (sharesOf[msg.sender] < sharesToBurn) {
            revert InsufficientShares();
        }

        assetsReturned = (sharesToBurn * accountedAssets) / totalShares;
        if (assetsReturned == 0) {
            revert InvalidAmount();
        }

        sharesOf[msg.sender] -= sharesToBurn;
        totalShares -= sharesToBurn;
        accountedAssets -= assetsReturned;

        if (asset == address(0)) {
            if (assetsReturned > address(this).balance) {
                revert InsufficientAssets();
            }
            (bool success,) = payable(msg.sender).call{value: assetsReturned}("");
            require(success, "Native transfer failed");
        } else {
            IERC20(asset).safeTransfer(msg.sender, assetsReturned);
        }

        emit Withdrawn(msg.sender, assetsReturned, sharesToBurn);
    }

    function addYield(uint256 amount) external payable onlyRole(MANAGER_ROLE) {
        if (amount == 0) {
            revert ZeroAmount();
        }

        if (asset == address(0)) {
            if (msg.value != amount) {
                revert InvalidAmount();
            }
        } else {
            if (msg.value != 0) {
                revert InvalidAmount();
            }
            IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        }

        accountedAssets += amount;
        emit YieldAdded(msg.sender, amount);
    }

    function recordLoss(uint256 amount) external onlyRole(MANAGER_ROLE) {
        if (amount == 0) {
            revert ZeroAmount();
        }
        if (amount > accountedAssets) {
            revert InsufficientAssets();
        }

        accountedAssets -= amount;
        emit LossRecorded(msg.sender, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function pricePerShare() external view returns (uint256) {
        if (totalShares == 0) {
            return 1e18;
        }
        return (accountedAssets * 1e18) / totalShares;
    }
}
