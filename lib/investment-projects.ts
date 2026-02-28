export type InvestmentProjectMeta = {
  name: string
  symbol: string
  description: string
  preview: string
}

export const INVESTMENT_PROJECTS: InvestmentProjectMeta[] = [
  {
    name: "BNBChain MCP",
    symbol: "BMCP",
    description: "AI-powered blockchain assistant with natural-language interactions on BSC and Greenfield.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=BNBChain+MCP",
  },
  {
    name: "LangChain AgentKit",
    symbol: "LCAK",
    description: "Developer stack for building BNB-enabled AI agents with LangChain integrations.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=LangChain+AgentKit",
  },
  {
    name: "EIP7702 Demo",
    symbol: "E7702",
    description: "Account-abstraction demonstration using authorized operations on BNB Smart Chain.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=EIP7702+Demo",
  },
  {
    name: "PancakeSwap API Swap",
    symbol: "PSWP",
    description: "Python + frontend testnet swap infrastructure for BEP-20 and tBNB execution flows.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=PancakeSwap+API+Swap",
  },
  {
    name: "4EVERLAND Hosting MCP",
    symbol: "4ELM",
    description: "AI-driven decentralized hosting assistant for Greenfield, IPFS, and Arweave deployment.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=4EVERLAND+Hosting+MCP",
  },
  {
    name: "Bridge BSC to opBNB",
    symbol: "BRDG",
    description: "Operational bridge workflow to move assets from BSC to opBNB with clear UX guides.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=Bridge+BSC+to+opBNB",
  },
  {
    name: "AI Reputation NFT",
    symbol: "ARNFT",
    description: "Wallet reputation analysis pipeline minting soulbound badges with AI explanations.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=AI+Reputation+NFT",
  },
  {
    name: "Chatbot UI Python",
    symbol: "CBOT",
    description: "Python chatbot UI for BNB agent workflows and API-driven dApp assistant features.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=Chatbot+UI+Python",
  },
  {
    name: "Eliza AgentKit",
    symbol: "ELZA",
    description: "Eliza-based AI agent integrations using BNB Chain plugins and modular action stacks.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=Eliza+AgentKit",
  },
  {
    name: "Chainsub Event Listener",
    symbol: "CSUB",
    description: "Minimal Go event-listener toolkit for EVM contracts across BNB-compatible networks.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=Chainsub+Event+Listener",
  },
  {
    name: "HashDit Security Extension",
    symbol: "HDIT",
    description: "Wallet transaction safety layer for high-risk web interactions in DeFi environments.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=HashDit+Security+Extension",
  },
  {
    name: "Telegram Token Faucet",
    symbol: "TGTF",
    description: "Go + Telegram bot infrastructure for token launch, faucet distribution, and wallet checks.",
    preview: "https://placehold.co/1200x600/0b0b0b/facc15?text=Telegram+Token+Faucet",
  },
]

export function getProjectMetaByPool(name: string, symbol: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "")
  const nName = normalize(name)
  const nSymbol = normalize(symbol)

  return (
    INVESTMENT_PROJECTS.find((project) => normalize(project.name) === nName || normalize(project.symbol) === nSymbol) ||
    null
  )
}
