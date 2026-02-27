import { BrowserProvider, Contract, JsonRpcProvider } from "ethers"

export const BSC_TESTNET = {
  chainIdHex: "0x61",
  chainId: 97,
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  explorer: "https://testnet.bscscan.com/address",
}

export const CONTRACTS = {
  DefaianceToken: "0x2723a914EA141bf0fBEa66Dd74e52420B372eddA",
  TreasuryVault: "0x64554e024f0528F413134A7E15d64FE356B01045",
  StartupPoolFactory: "0xd5222f4a8d111913d7A57F9AE0C251F128Bd8050",
  MarketplaceEscrow: "0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1",
  OracleAdapter: "0xbE3Eee190a1FF8433F0082D965A60092D3F6433d",
  DefaianceDAO: "0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA",
  StakingRewards: "0x33239306014423E21e2E37f1fA495C57a290d13a",
  TokenVesting: "0xEeda9e7BA71d5383849cC849c150e751323FDb4D",
} as const

export const ABIS = {
  token: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
  ],
  factory: [
    "function poolsCount() view returns (uint256)",
    "function allPools(uint256) view returns (address)",
    "function poolInfo(address) view returns (address pool, address asset, string name, string symbol)",
  ],
  pool: [
    "function asset() view returns (address)",
    "function poolName() view returns (string)",
    "function poolSymbol() view returns (string)",
    "function accountedAssets() view returns (uint256)",
    "function totalShares() view returns (uint256)",
    "function pricePerShare() view returns (uint256)",
    "function sharesOf(address) view returns (uint256)",
  ],
  dao: [
    "function proposalCount() view returns (uint256)",
    "function proposals(uint256) view returns (address proposer,address target,uint256 value,bytes data,string description,uint256 startBlock,uint256 endBlock,uint256 eta,uint256 forVotes,uint256 againstVotes,uint256 abstainVotes,bool executed,bool canceled)",
  ],
  staking: [
    "function balanceOf(address) view returns (uint256)",
    "function earned(address) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
  ],
  vesting: [
    "function releasableAmount(address) view returns (uint256)",
  ],
} as const

export function getReadProvider() {
  return new JsonRpcProvider(BSC_TESTNET.rpcUrl)
}

export function getReadContract(address: string, abi: readonly string[]) {
  return new Contract(address, abi, getReadProvider())
}

export async function getBrowserProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Wallet not found")
  }

  return new BrowserProvider(window.ethereum)
}

export async function getWalletAddress() {
  if (typeof window === "undefined" || !window.ethereum) return null

  const accounts = await window.ethereum.request({ method: "eth_accounts" })
  if (!Array.isArray(accounts) || !accounts.length) return null
  return accounts[0] as string
}

declare global {
  interface Window {
    ethereum?: any
  }
}
