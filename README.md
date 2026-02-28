# DEFAIANCE

BNB Chain-native platform for startup discovery, on-chain investing, governance, staking, and portfolio analytics.

## Grant-Ready One-Liner

DEFAIANCE turns startup investing into a transparent, permissionless on-chain workflow on BNB Smart Chain: list a project, invest via pool shares, govern via DAO, stake rewards, and track value in real time.

---

## 1) What This Product Does (A to Z)

### A. Discovery and Listing
- Public listing flow via `Submit Product`
- URL scrape endpoint auto-fills project name, symbol, and summary
- Permissionless pool creation via factory contract

### B. Investment
- Users invest into startup pools on-chain
- Supports native BNB pool mode and ERC20 asset pool mode
- Share-based accounting (`deposit`/`withdraw`) with transparent pool math

### C. Governance
- DFAI token voting power (snapshot-based)
- Proposal lifecycle: create → vote → queue → execute
- Timelock-backed execution model

### D. Yield / Rewards
- DFAI staking contract with emission scheduling
- User actions: stake, withdraw, claim, exit

### E. Portfolio Intelligence
- Wallet balances + pool holdings
- Redeem value estimates and allocation pie charts
- Real-time market-assisted valuation layer

### F. Marketplace and Escrow
- On-chain pool marketplace and project pages
- Escrow contract with dispute and arbiter settlement

---

## 2) Dashboard / Board Functionalities

Main modules available from the dashboard:
- Invest
- Marketplace
- Portfolio
- DAO
- AI Analytics
- Markets

What users can do on the board:
- Monitor protocol and wallet metrics
- Enter/exit pools
- Vote on governance proposals
- Stake and claim rewards
- Track market and portfolio movements

---

## 3) On-Chain Architecture (A to Z)

Contracts are modular and role-based.

### Contract Suite
- `DefaianceToken.sol` — ERC20 + Permit + Votes + Burnable + role-based minting
- `TreasuryVault.sol` — treasury custody for native/token assets
- `StartupPoolFactory.sol` — permissionless startup pool deployment
- `InvestmentPool.sol` — share accounting, deposits/withdrawals, manager PnL updates
- `DefaianceDAO.sol` — proposal, voting, queueing, execution
- `StakingRewards.sol` — staking and rewards emissions
- `TokenVesting.sol` — linear vesting with optional revoke/refund
- `MarketplaceEscrow.sol` — escrow creation/release/refund/dispute handling
- `OracleAdapter.sol` — role-fed pricing with stale checks

### Core roles used
- `DEFAULT_ADMIN_ROLE`
- `MINTER_ROLE`
- `TREASURER_ROLE`
- `MANAGER_ROLE`
- `ARBITER_ROLE`
- `EXECUTOR_ROLE`
- `REWARD_DISTRIBUTOR_ROLE`
- `ORACLE_UPDATER_ROLE`

Deep smart-contract docs:
- `smart-contracts/README.md`
- `smart-contracts/README_DEEP_DIVE.md`

---

## 4) Smart Contract Deployment (A to Z)

### Stack
- Hardhat
- Solidity `0.8.24`
- OpenZeppelin contracts
- BSC Testnet + BSC Mainnet network configs

### Deploy flow
1. Configure env in `smart-contracts/.env`
2. Compile contracts
3. Run deployment script
4. Verify on BscScan
5. Update frontend addresses in `lib/onchain.ts`

### Commands
```bash
cd smart-contracts
npm install
npm run compile
npm test
npm run deploy:bscTestnet
```

### Deployment artifacts
- `smart-contracts/deployments/bscTestnet.json`

---

## 5) Live Contract Links + Tracking Links

### Active deployed set (frontend config)
| Contract | Address | Link |
|---|---|---|
| DefaianceToken | `0x2723a914EA141bf0fBEa66Dd74e52420B372eddA` | https://testnet.bscscan.com/address/0x2723a914EA141bf0fBEa66Dd74e52420B372eddA |
| TreasuryVault | `0x64554e024f0528F413134A7E15d64FE356B01045` | https://testnet.bscscan.com/address/0x64554e024f0528F413134A7E15d64FE356B01045 |
| StartupPoolFactory | `0x5cd6085759F2a378FD227Be036126009FBaCBDCD` | https://testnet.bscscan.com/address/0x5cd6085759F2a378FD227Be036126009FBaCBDCD |
| MarketplaceEscrow | `0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1` | https://testnet.bscscan.com/address/0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1 |
| OracleAdapter | `0xbE3Eee190a1FF8433F0082D965A60092D3F6433d` | https://testnet.bscscan.com/address/0xbE3Eee190a1FF8433F0082D965A60092D3F6433d |
| DefaianceDAO | `0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA` | https://testnet.bscscan.com/address/0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA |
| StakingRewards | `0x33239306014423E21e2E37f1fA495C57a290d13a` | https://testnet.bscscan.com/address/0x33239306014423E21e2E37f1fA495C57a290d13a |
| TokenVesting | `0xEeda9e7BA71d5383849cC849c150e751323FDb4D` | https://testnet.bscscan.com/address/0xEeda9e7BA71d5383849cC849c150e751323FDb4D |

### Verified-on-BscScan links
| Contract | Verified Code Link |
|---|---|
| DefaianceToken | https://testnet.bscscan.com/address/0x2723a914EA141bf0fBEa66Dd74e52420B372eddA#code |
| TreasuryVault | https://testnet.bscscan.com/address/0x64554e024f0528F413134A7E15d64FE356B01045#code |
| StartupPoolFactory | https://testnet.bscscan.com/address/0xd5222f4a8d111913d7A57F9AE0C251F128Bd8050#code |
| MarketplaceEscrow | https://testnet.bscscan.com/address/0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1#code |
| OracleAdapter | https://testnet.bscscan.com/address/0xbE3Eee190a1FF8433F0082D965A60092D3F6433d#code |
| DefaianceDAO | https://testnet.bscscan.com/address/0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA#code |
| StakingRewards | https://testnet.bscscan.com/address/0x33239306014423E21e2E37f1fA495C57a290d13a#code |
| TokenVesting | https://testnet.bscscan.com/address/0xEeda9e7BA71d5383849cC849c150e751323FDb4D#code |

### Tracking templates
- Contract events: `https://testnet.bscscan.com/address/<CONTRACT>#events`
- Internal transactions: `https://testnet.bscscan.com/address/<CONTRACT>#internaltx`
- Transactions list: `https://testnet.bscscan.com/address/<CONTRACT>#txs`
- Wallet tracker: `https://testnet.bscscan.com/address/<WALLET>`

---

## 6) End-User Smart Contract Usage

### Investor journey
1. Connect wallet on BSC Testnet
2. Open marketplace/invest page
3. Deposit to pool (`InvestmentPool.deposit`)
4. Hold shares (`sharesOf`)
5. Redeem shares (`InvestmentPool.withdraw`)
6. Monitor holdings in portfolio and charts

### Governance participant journey
1. Hold and delegate DFAI
2. Create proposal (`DefaianceDAO.propose`)
3. Vote (`castVote`)
4. Queue and execute after timelock

### Staker journey
1. Approve DFAI spend
2. Stake (`StakingRewards.stake`)
3. Claim (`getReward`) or exit (`exit`)

---

## 7) BNB Ecosystem Components Used

This project uses BNB ecosystem primitives directly:
- BNB Smart Chain (EVM) contracts
- BSC Testnet deployment + operation
- Native BNB as pool asset option
- BscScan verification and contract tracking
- BNB Chain Cookbook as project discovery source in marketplace

This aligns with BNB grant expectations around:
- On-chain utility
- User onboarding through wallet-native UX
- Transparent smart-contract execution
- Public verifiability of protocol actions

---

## 8) APIs and Keys (A to Z list)

> Never commit real secrets. Use `.env` and CI secrets only.

### Frontend / app env vars
- `NEXT_PUBLIC_BSC_TESTNET_RPC_URL`
  - Where: `lib/onchain.ts`
  - Purpose: RPC endpoint for read provider

- `SERPAPI_API_KEY`
  - Where: `app/api/markets/route.ts`
  - Purpose: Google Finance market feed via SerpAPI

- `NEXT_PUBLIC_GOOGLE_MARKET_ANALYTICS_API_KEY`
  - Where: `app/api/markets/route.ts` (fallback alias)
  - Purpose: alternate env name for market feed key

### Smart-contract env vars
- `PRIVATE_KEY`
  - Where: `smart-contracts/hardhat.config.ts`
  - Purpose: deployer signer

- `BSC_TESTNET_RPC_URL`
  - Where: `smart-contracts/hardhat.config.ts`
  - Purpose: testnet deployment RPC

- `BSC_MAINNET_RPC_URL`
  - Where: `smart-contracts/hardhat.config.ts`
  - Purpose: mainnet deployment RPC

- `BSCSCAN_API_KEY`
  - Where: `smart-contracts/hardhat.config.ts`
  - Purpose: source-code verification on BscScan

- `TREASURY_ADDRESS`
  - Where: `smart-contracts/scripts/deploy.ts`
  - Purpose: initial treasury recipient override

### API fallback behavior
- Markets endpoint automatically falls back to Binance public ticker feed when SerpAPI key is unavailable.

---

## 9) API Endpoints in Product

- `GET /api/markets`
  - Global market data (SerpAPI) + Binance fallback

- `GET /api/product-scrape?url=<project_url>`
  - Scrapes metadata for listing auto-fill

---

## 10) Repository Structure

- `app/` — Next.js App Router pages and API routes
- `components/` — UI and feature components
- `lib/` — on-chain adapters, ABIs, address config
- `smart-contracts/contracts/` — Solidity contracts
- `smart-contracts/scripts/` — deployment and seeding scripts
- `smart-contracts/test/` — contract test suites
- `smart-contracts/deployments/` — deployment artifacts

---

## 11) Security and Operations Notes

- Access control is role-gated across contracts
- Reentrancy guards used on fund-moving paths
- Proposal execution is timelock-queued in DAO lifecycle
- Production recommendation: move admin/operator roles to multisig

---

## 12) Why This Is Strong for BNB Grant Evaluation

- Clear BNB-native on-chain utility with working modules
- Verified contracts and transparent tracking links
- Permissionless listing and investment mechanics
- Real user flows from wallet connect to on-chain transactions
- Public, testable architecture with deployment and test scripts

---

## 13) Quick Start

### App
```bash
pnpm install
pnpm dev
```

### Contracts
```bash
cd smart-contracts
npm install
npm run compile
npm test
```

---

## 14) Final Note

Thank you for reviewing DEFAIANCE.

- Built to advance startup finance on BNB Chain
- Designed for transparent, verifiable, and permissionless participation
- Ready for continued scaling with the BNB ecosystem

If you are evaluating this project for ecosystem support or grants, this repository includes product flows, live contract tracking, deployment artifacts, and deep smart-contract documentation from end to end.
