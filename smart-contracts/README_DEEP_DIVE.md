# DEFAIANCE Smart Contracts Deep Dive

This document is the full on-chain architecture and functionality guide for DEFAIANCE.

## 1) On-Chain Scope

DEFAIANCE is built as a modular protocol on BNB Smart Chain (currently BSC Testnet in this repo). The system is split into contracts for:

- Token + governance voting power
- Treasury custody
- Startup pool creation and pool accounting
- Escrow settlement
- DAO lifecycle
- Staking rewards
- Team/investor vesting
- Price adapter support

The contracts are designed to be composable (independent modules that can be integrated by frontend and governance flows).

---

## 2) Deployed Network and Addresses

Source of truth in this repo:
- `smart-contracts/deployments/bscTestnet.json`
- `lib/onchain.ts`

### BSC Testnet (chainId 97)

- DefaianceToken: `0x2723a914EA141bf0fBEa66Dd74e52420B372eddA`
- TreasuryVault: `0x64554e024f0528F413134A7E15d64FE356B01045`
- StartupPoolFactory: `0x5cd6085759F2a378FD227Be036126009FBaCBDCD`
- MarketplaceEscrow: `0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1`
- OracleAdapter: `0xbE3Eee190a1FF8433F0082D965A60092D3F6433d`
- DefaianceDAO: `0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA`
- StakingRewards: `0x33239306014423E21e2E37f1fA495C57a290d13a`
- TokenVesting: `0xEeda9e7BA71d5383849cC849c150e751323FDb4D`

### Verified on BscScan

- DefaianceToken: https://testnet.bscscan.com/address/0x2723a914EA141bf0fBEa66Dd74e52420B372eddA#code
- TreasuryVault: https://testnet.bscscan.com/address/0x64554e024f0528F413134A7E15d64FE356B01045#code
- StartupPoolFactory: https://testnet.bscscan.com/address/0xd5222f4a8d111913d7A57F9AE0C251F128Bd8050#code
- MarketplaceEscrow: https://testnet.bscscan.com/address/0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1#code
- OracleAdapter: https://testnet.bscscan.com/address/0xbE3Eee190a1FF8433F0082D965A60092D3F6433d#code
- DefaianceDAO: https://testnet.bscscan.com/address/0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA#code
- StakingRewards: https://testnet.bscscan.com/address/0x33239306014423E21e2E37f1fA495C57a290d13a#code
- TokenVesting: https://testnet.bscscan.com/address/0xEeda9e7BA71d5383849cC849c150e751323FDb4D#code

---

## 3) Architecture (High-Level)

### Core topology

1. `DefaianceToken` is the governance + utility token.
2. `StartupPoolFactory` permissionlessly deploys `InvestmentPool` contracts.
3. Each `InvestmentPool` tracks shares vs accounted assets and supports manager-side yield/loss accounting.
4. `DefaianceDAO` reads vote snapshots from the token (`IVotes`) and can execute approved actions through timelock queueing.
5. `StakingRewards` allows staking DFAI and earning reward emissions.
6. `TokenVesting` manages linear unlock schedules.
7. `TreasuryVault` is controlled custody for protocol funds.
8. `MarketplaceEscrow` supports buyer/seller settlement and dispute resolution.
9. `OracleAdapter` stores off-chain-fed prices with stale checks for consumers.

### Why this split

- Clear separation of concerns
- Easier upgrades/migrations by replacing single modules
- Reduced blast radius if one module has an issue
- Better frontend integration by exposing focused interfaces

---

## 4) Roles and Permission Model

### Global role approach

Contracts use OpenZeppelin `AccessControl`. Admin powers are explicit and per-contract.

### Role matrix

- `DEFAULT_ADMIN_ROLE`
  - Present in all contracts
  - Manages privileged configuration and role grants

- `DefaianceToken.MINTER_ROLE`
  - Can mint DFAI

- `TreasuryVault.TREASURER_ROLE`
  - Can withdraw native/token assets from vault

- `InvestmentPool.MANAGER_ROLE`
  - Can add yield and record loss in pool accounting

- `MarketplaceEscrow.ARBITER_ROLE`
  - Can release and resolve disputed escrows

- `DefaianceDAO.EXECUTOR_ROLE`
  - Can execute queued proposals

- `StakingRewards.REWARD_DISTRIBUTOR_ROLE`
  - Can start/update reward emissions via `notifyRewardAmount`

- `OracleAdapter.ORACLE_UPDATER_ROLE`
  - Can push price updates

Security note: this repo deploy script initializes many roles to deployer for test/dev velocity. For production, use multisig + dedicated operators.

---

## 5) Contract-by-Contract Deep Functionality

## 5.1 `DefaianceToken.sol`

### Purpose

DFAI token with:
- ERC20 transferability
- Burn support
- Permit (gasless approvals)
- Vote checkpointing (`ERC20Votes`) for DAO snapshot voting
- Role-gated minting

### Key storage and constants

- `MINTER_ROLE`

### Constructor behavior

- Requires non-zero admin + treasury
- Grants admin and minter to admin
- Optionally mints initial supply to treasury

### Core functions

- `mint(address to, uint256 amount)`
  - Access: `MINTER_ROLE`
  - Mints tokens

- `_update(...)`
  - Internal override required for ERC20 + Votes composition

- `nonces(address owner)`
  - Override for `ERC20Permit` + `Nonces`

### Token governance impact

Votes in DAO are snapshot-based via delegated balances (`getPastVotes`). Holders must delegate to activate voting power.

---

## 5.2 `TreasuryVault.sol`

### Purpose

Protocol treasury for native BNB and ERC20 assets with strict treasurer-controlled outflows.

### Core behaviors

- Native deposits through `receive()` (non-zero only)
- Token deposits through `depositToken`
- Withdrawals restricted to `TREASURER_ROLE`
- Reentrancy protection on withdrawal paths

### Core functions

- `depositToken(address token, uint256 amount)`
- `withdrawToken(address token, address to, uint256 amount)`
- `withdrawNative(address payable to, uint256 amount)`

### Important invariants

- Zero addresses/amounts rejected
- Native withdrawal checks vault balance first

---

## 5.3 `InvestmentPool.sol`

### Purpose

Pool accounting primitive for startup investment positions with share mint/burn logic.

### Assets model

- `asset == address(0)` => native BNB pool
- `asset != address(0)` => ERC20 asset pool

### Accounting model

- `totalShares`: aggregate issued shares
- `accountedAssets`: NAV-like accounting base used for pro-rata entry/exit
- `sharesOf[user]`: user share balance

### Core functions

- `deposit(uint256 amount)`
  - For native pool, amount comes from `msg.value`
  - For ERC20 pool, transfers asset from user
  - Mints shares at current ratio

- `withdraw(uint256 sharesToBurn)`
  - Burns user shares
  - Returns proportional assets

- `addYield(uint256 amount)` (`MANAGER_ROLE`)
  - Increases `accountedAssets` and transfers funds in

- `recordLoss(uint256 amount)` (`MANAGER_ROLE`)
  - Decreases `accountedAssets`

- `pause()` / `unpause()` (`DEFAULT_ADMIN_ROLE`)

- `pricePerShare()`
  - Returns 1e18 baseline when no shares
  - Else `accountedAssets * 1e18 / totalShares`

### Practical interpretation

- Deposits and withdrawals are deterministic from accounting state
- Manager can express PnL events without changing share balances directly
- Share price captures pool performance over time

---

## 5.4 `StartupPoolFactory.sol`

### Purpose

Deploys new `InvestmentPool` contracts and indexes metadata for discovery.

### Permissioning

`createPool` is permissionless in current implementation (only requires non-zero manager).

### Core functions

- `createPool(address asset, address manager, string name, string symbol)`
  - Deploys new `InvestmentPool` with:
    - admin = caller (`msg.sender`)
    - manager = provided manager

- `poolsCount()`
- `allPools(index)`
- `poolInfo(poolAddress)`

### System importance

Factory is the entry point for new startup listings and powers marketplace indexing.

---

## 5.5 `MarketplaceEscrow.sol`

### Purpose

Escrow for p2p settlement with optional disputes and arbiter splits.

### Deal lifecycle

1. Buyer creates escrow and deposits native/ERC20.
2. Buyer or arbiter releases to seller, OR
3. Seller/arbiter refunds buyer (deadline/dispute rules), OR
4. Arbiter resolves dispute with amount split.

### Core functions

- `createEscrow(seller, token, amount, deadline)`
- `release(dealId)`
- `refund(dealId)`
- `raiseDispute(dealId)`
- `resolveDispute(dealId, sellerAmount)`

### Safety behavior

- State-gated transitions (`released/resolved/disputed`)
- Reentrancy guard on asset-transfer functions

---

## 5.6 `DefaianceDAO.sol`

### Purpose

On-chain proposal/vote/queue/execute governance using token snapshots.

### Governance parameters

- `proposalThreshold`
- `votingDelayBlocks`
- `votingPeriodBlocks`
- `quorumBps`
- `timelockDelay`

### Proposal lifecycle

1. **Propose** (requires proposer past votes >= threshold)
2. **Pending** until `startBlock`
3. **Active** voting window
4. **Succeeded** if quorum and forVotes > againstVotes
5. **Queued** with ETA (`timelockDelay`)
6. **Executed** by executor role after ETA

Alternative terminal states:
- `Defeated`
- `Canceled`

### Core functions

- `propose(target, value, data, description)`
- `castVote(proposalId, support)` where support:
  - 0 = against, 1 = for, 2 = abstain
- `queue(proposalId)`
- `execute(proposalId)` (`EXECUTOR_ROLE`)
- `cancel(proposalId)`
- `state(proposalId)`
- `quorum(blockNumber)`
- `updateGovernanceParams(...)` (`DEFAULT_ADMIN_ROLE`)

### Design notes

- Voting power snapshot uses `proposal.startBlock`
- Quorum counts `for + abstain`
- Execution is arbitrary call to `target` with calldata and optional value

---

## 5.7 `StakingRewards.sol`

### Purpose

Classic time-based reward distribution for staking token holders.

### Model

- Users stake `stakingToken`
- Rewards emitted as `rewardsToken`
- Reward accrual is per-token and time-proportional

### Core functions

- `stake(amount)`
- `withdraw(amount)`
- `getReward()`
- `exit()` (withdraw all + claim)
- `notifyRewardAmount(reward, duration)` (`REWARD_DISTRIBUTOR_ROLE`)

### Important state

- `rewardRate`, `rewardsDuration`, `periodFinish`
- `rewardPerTokenStored`, `lastUpdateTime`
- Per-user checkpoints and accrued rewards

### Operational note

If new rewards are added before previous period finishes, leftover reward value is blended into a new rate.

---

## 5.8 `TokenVesting.sol`

### Purpose

Linear vesting schedules with cliff, optional revocation, and treasury refund.

### Schedule model

Each beneficiary has one active schedule record:
- `totalAmount`
- `releasedAmount`
- `start`, `cliff`, `duration`
- `cancelable`, `revoked`

### Core functions

- `createSchedule(beneficiary, amount, start, cliffDuration, duration, cancelable)` (`DEFAULT_ADMIN_ROLE`)
- `releasableAmount(beneficiary)` (view)
- `release()` (beneficiary claims unlocked amount)
- `revoke(beneficiary)` (`DEFAULT_ADMIN_ROLE`)
- `setTreasury(address)` (`DEFAULT_ADMIN_ROLE`)

### Revocation semantics

On revoke:
- Already vested but unreleased amount goes to beneficiary
- Unvested remainder goes to treasury

---

## 5.9 `OracleAdapter.sol`

### Purpose

Simple role-updated price store with stale-data protection.

### Model

- Pair key: `bytes32 pairId` (e.g., `keccak256("BNB_USDT")`)
- Stored fields: `price`, `updatedAt`
- Freshness control: `maxPriceAge`

### Core functions

- `setPrice(pairId, price)` (`ORACLE_UPDATER_ROLE`)
- `getPrice(pairId)` (reverts if unavailable/stale)
- `setMaxPriceAge(maxPriceAge)` (`DEFAULT_ADMIN_ROLE`)

### Usage pattern

Off-chain updater pushes values; consumers read only fresh data.

---

## 6) End-to-End On-Chain Workflows

## A) Startup listing and investment

1. Caller creates pool via `StartupPoolFactory.createPool(...)`.
2. Frontend discovers pool from factory indices.
3. Investor deposits native/ERC20 into `InvestmentPool.deposit(...)`.
4. Investor receives pool shares (`sharesOf`).
5. Investor exits via `withdraw(shares)` for proportional assets.

## B) Pool performance accounting

1. Manager contributes yield via `addYield`.
2. Or records downside via `recordLoss`.
3. `pricePerShare` updates and impacts all entry/exit exchange rates.

## C) Governance execution

1. Token holders delegate DFAI.
2. Proposer submits DAO proposal targeting any contract call.
3. Holders vote.
4. If passed, proposal is queued and later executed by executor.

## D) Staking and rewards

1. User stakes DFAI in `StakingRewards`.
2. Distributor funds emission program.
3. User accrues rewards over time and claims via `getReward` or `exit`.

## E) Vesting

1. Admin creates vesting schedule (funded by transfer in).
2. Beneficiary claims unlocked tokens over time.
3. Admin may revoke (if cancelable), sending unvested remainder to treasury.

---

## 7) Frontend Integration Surface (Current Repo)

The app reads/writes on-chain via `lib/onchain.ts`:

- Read provider: JSON-RPC BSC testnet
- Wallet signer: browser injected wallet
- ABI fragments include ERC20, pool factory, investment pool, DAO, staking

Primary pages connected to contracts:

- Invest page: pool discovery, deposit/withdraw, share stats
- Portfolio page: wallet balances, holdings, redeem estimates, staking actions
- DAO page: proposal/vote state reads and voting calls
- Marketplace page: pool discovery + metrics

---

## 8) Deployment and Seeding

Scripts in `smart-contracts/scripts`:

- `deploy.ts`:
  - Deploys full protocol suite
  - Sets initial DAO params:
    - proposal threshold: 100000 DFAI
    - voting delay: 100 blocks
    - voting period: 28800 blocks
    - quorum: 400 bps (4%)
    - timelock delay: 86400 seconds

- `deployFactory.ts`:
  - Deploys factory only

- `seedInvestmentProjects.ts`:
  - Seeds multiple named pools on testnet via `createPool`

---

## 9) Security Notes and Hardening Checklist

Current suite includes strong baseline controls (`AccessControl`, `ReentrancyGuard`, explicit state checks). Before production mainnet, recommended hardening:

1. Move admin/operator roles to multisig
2. Separate proposer/executor authority in DAO ops model
3. Add emergency playbooks for pause/role rotation
4. Add invariants/fuzz tests for pool accounting and staking math
5. Add independent audit before mainnet launch
6. Pin formal upgrade/migration strategy (contracts are non-upgradeable as written)

---

## 10) Test Coverage in Repo

Test files:

- `test/core.spec.ts`
- `test/factory-oracle.spec.ts`
- `test/governance-rewards.spec.ts`

Covered behaviors include:
- Role enforcement
- Deposit/withdraw flows
- Share accounting
- DAO lifecycle
- Reward accrual and exit
- Vesting release/revocation
- Oracle stale checks

---

## 11) Quick Commands

From `smart-contracts`:

```bash
npm install
npm run compile
npm test
npm run deploy:bscTestnet
```

---

## 12) Limitations / Assumptions (Current Version)

- Deployment artifact in repo is currently testnet-only.
- Factory-created pool admin is the transaction sender (`msg.sender`).
- Oracle values are trusted from updater role (not decentralized oracle network by default).
- DAO execution authority still requires executor role.

These choices are practical for current stage and can be tightened for production governance decentralization.
