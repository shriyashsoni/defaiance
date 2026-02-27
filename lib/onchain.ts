import { BrowserProvider, Contract, JsonRpcProvider, formatEther } from "ethers"

export const CONTRACTS = {
  chainId: 97,
  rpcUrl: process.env.NEXT_PUBLIC_BSC_TESTNET_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545",
  defaianceToken: "0x2723a914EA141bf0fBEa66Dd74e52420B372eddA",
  treasuryVault: "0x64554e024f0528F413134A7E15d64FE356B01045",
  startupPoolFactory: "0x5cd6085759F2a378FD227Be036126009FBaCBDCD",
  marketplaceEscrow: "0x3468b7eb5F42f5d409194028daA48EDDBC9Df4F1",
  oracleAdapter: "0xbE3Eee190a1FF8433F0082D965A60092D3F6433d",
  defaianceDAO: "0xF541363aF639D19dB8d5a136b87d166Ce1fC1fbA",
  stakingRewards: "0x33239306014423E21e2E37f1fA495C57a290d13a",
  tokenVesting: "0xEeda9e7BA71d5383849cC849c150e751323FDb4D",
} as const

export const ABIS = {
  erc20: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner,address spender) view returns (uint256)",
    "function approve(address spender,uint256 amount) returns (bool)",
  ],
  poolFactory: [
    "function poolsCount() view returns (uint256)",
    "function allPools(uint256) view returns (address)",
    "function poolInfo(address) view returns (address pool,address asset,string name,string symbol)",
    "function createPool(address asset,address manager,string name,string symbol) returns (address)",
  ],
  investmentPool: [
    "function poolName() view returns (string)",
    "function poolSymbol() view returns (string)",
    "function asset() view returns (address)",
    "function totalShares() view returns (uint256)",
    "function accountedAssets() view returns (uint256)",
    "function pricePerShare() view returns (uint256)",
    "function sharesOf(address) view returns (uint256)",
    "function deposit(uint256 amount) payable returns (uint256)",
    "function withdraw(uint256 sharesToBurn) returns (uint256)",
  ],
  dao: [
    "function proposalCount() view returns (uint256)",
    "function proposalThreshold() view returns (uint256)",
    "function quorumBps() view returns (uint256)",
    "function votingDelayBlocks() view returns (uint256)",
    "function votingPeriodBlocks() view returns (uint256)",
    "function state(uint256 proposalId) view returns (uint8)",
    "function castVote(uint256 proposalId,uint8 support)",
    "function proposals(uint256) view returns (address proposer,address target,uint256 value,bytes data,string description,uint256 startBlock,uint256 endBlock,uint256 eta,uint256 forVotes,uint256 againstVotes,uint256 abstainVotes,bool executed,bool canceled)",
  ],
  staking: [
    "function totalSupply() view returns (uint256)",
    "function rewardRate() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function stake(uint256 amount)",
    "function withdraw(uint256 amount)",
    "function getReward()",
  ],
} as const

export function getReadProvider() {
  return new JsonRpcProvider(CONTRACTS.rpcUrl)
}

export async function getWalletContext() {
  if (typeof window === "undefined" || !window.ethereum) {
    return { account: null as string | null, provider: null as BrowserProvider | null }
  }

  const provider = new BrowserProvider(window.ethereum)
  const accounts = await window.ethereum.request({ method: "eth_accounts" })
  return {
    account: Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null,
    provider,
  }
}

export async function getWalletSigner() {
  if (typeof window === "undefined" || !window.ethereum) {
    return null
  }

  await window.ethereum.request({ method: "eth_requestAccounts" })
  const provider = new BrowserProvider(window.ethereum)
  return provider.getSigner()
}

export function getContract(address: string, abi: readonly string[], provider: JsonRpcProvider | BrowserProvider) {
  return new Contract(address, abi, provider)
}

export function toEth(value: bigint | null | undefined, precision = 4) {
  if (value == null) return "0"
  return Number(formatEther(value)).toFixed(precision)
}

declare global {
  interface Window {
    ethereum?: any
  }
}
