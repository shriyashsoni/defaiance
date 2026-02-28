# DefAIance Smart Contracts (BNB Smart Chain)

This package contains a modular smart-contract suite for DefAIance.

## Full Architecture Documentation

For the complete on-chain deep dive (all contracts, role model, workflows, and functionality details), see:

- `README_DEEP_DIVE.md`

## Verified on BscScan (BSC Testnet)

- DefaianceToken: https://testnet.bscscan.com/address/0x2723a914EA141bf0fBEa66Dd74e52420B372eddA#code
- TreasuryVault: https://testnet.bscscan.com/address/0x64554e024f0528F413134A7E15d64FE356B01045#code
- StartupPoolFactory: https://testnet.bscscan.com/address/0xd5222f4a8d111913d7A57F9AE0C251F128Bd8050#code
- MarketplaceEscrow: https://testnet.bscscan.com/address/0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1#code
- OracleAdapter: https://testnet.bscscan.com/address/0xbE3Eee190a1FF8433F0082D965A60092D3F6433d#code
- DefaianceDAO: https://testnet.bscscan.com/address/0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA#code
- StakingRewards: https://testnet.bscscan.com/address/0x33239306014423E21e2E37f1fA495C57a290d13a#code
- TokenVesting: https://testnet.bscscan.com/address/0xEeda9e7BA71d5383849cC849c150e751323FDb4D#code

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
