// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract OracleAdapter is AccessControl {
    bytes32 public constant ORACLE_UPDATER_ROLE = keccak256("ORACLE_UPDATER_ROLE");

    struct PriceData {
        uint256 price;
        uint64 updatedAt;
    }

    mapping(bytes32 => PriceData) public prices;
    uint256 public maxPriceAge;

    event PriceUpdated(bytes32 indexed pairId, uint256 price, uint64 updatedAt);
    event MaxPriceAgeUpdated(uint256 maxPriceAge);

    error ZeroAddress();
    error ZeroPrice();
    error StalePrice();
    error PriceNotAvailable();

    constructor(address admin, address updater, uint256 maxPriceAge_) {
        if (admin == address(0) || updater == address(0)) {
            revert ZeroAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_UPDATER_ROLE, updater);

        maxPriceAge = maxPriceAge_;
    }

    function setPrice(bytes32 pairId, uint256 price) external onlyRole(ORACLE_UPDATER_ROLE) {
        if (price == 0) {
            revert ZeroPrice();
        }

        uint64 updatedAt = uint64(block.timestamp);
        prices[pairId] = PriceData({price: price, updatedAt: updatedAt});

        emit PriceUpdated(pairId, price, updatedAt);
    }

    function getPrice(bytes32 pairId) external view returns (uint256 price, uint64 updatedAt) {
        PriceData memory data = prices[pairId];
        if (data.updatedAt == 0) {
            revert PriceNotAvailable();
        }
        if (block.timestamp > data.updatedAt + maxPriceAge) {
            revert StalePrice();
        }

        return (data.price, data.updatedAt);
    }

    function setMaxPriceAge(uint256 maxPriceAge_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        maxPriceAge = maxPriceAge_;
        emit MaxPriceAgeUpdated(maxPriceAge_);
    }
}
