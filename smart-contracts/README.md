# DefAIance Smart Contracts (BNB Smart Chain)

This package contains a modular smart-contract suite for DefAIance.

## Contracts

- `DefaianceToken.sol` - BEP-20 compatible governance + utility token (`ERC20Votes`, permit, burnable, role-based minting)
- `TreasuryVault.sol` - Native/token treasury with role-based withdrawals
- `InvestmentPool.sol` - Token/BNB investment pool with share accounting and manager yield/loss controls
- `MarketplaceEscrow.sol` - Marketplace escrow with dispute workflow and arbiter resolution
- `DefaianceDAO.sol` - On-chain governance using vote snapshots from `ERC20Votes`
- `StakingRewards.sol` - Staking + rewards distribution engine
- `TokenVesting.sol` - Linear vesting with optional revocation and treasury refund
- `StartupPoolFactory.sol` - Factory for creating investment pools
- `OracleAdapter.sol` - Role-controlled oracle price adapter with staleness checks

## Setup

```bash
cd smart-contracts
cp .env.example .env
npm install
npm run compile
```

## Deploy

```bash
npm run deploy:bscTestnet
# or
npm run deploy:bscMainnet
```

## Notes

- Set `PRIVATE_KEY`, RPC URLs, and `BSCSCAN_API_KEY` in `.env`.
- `TREASURY_ADDRESS` is optional; defaults to deployer.
- Governance thresholds, quorum, and periods in `scripts/deploy.ts` are defaults and should be tuned for production.
