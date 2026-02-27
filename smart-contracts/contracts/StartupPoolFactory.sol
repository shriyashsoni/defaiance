// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./InvestmentPool.sol";

contract StartupPoolFactory is AccessControl {
    struct PoolMetadata {
        address pool;
        address asset;
        string name;
        string symbol;
    }

    address[] public allPools;
    mapping(address => PoolMetadata) public poolInfo;

    event PoolCreated(address indexed pool, address indexed asset, address indexed manager, string name, string symbol);

    error ZeroAddress();

    constructor(address admin) {
        if (admin == address(0)) {
            revert ZeroAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function createPool(address asset, address manager, string calldata name, string calldata symbol)
        external
        returns (address pool)
    {
        if (manager == address(0)) {
            revert ZeroAddress();
        }

        InvestmentPool newPool = new InvestmentPool(asset, msg.sender, manager, name, symbol);
        pool = address(newPool);

        allPools.push(pool);
        poolInfo[pool] = PoolMetadata({pool: pool, asset: asset, name: name, symbol: symbol});

        emit PoolCreated(pool, asset, manager, name, symbol);
    }

    function poolsCount() external view returns (uint256) {
        return allPools.length;
    }
}
