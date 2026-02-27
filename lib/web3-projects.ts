export type Web3Project = {
  title: string
  description: string
  tags: string[]
  link: string
  featured?: boolean
}

export const WEB3_PROJECTS: Web3Project[] = [
  {
    title: "BNBChain MCP - AI-Powered Blockchain Assistant",
    description:
      "A ready-to-use template that combines BNB Chain MCP with Claude AI, enabling natural language interaction with BSC and Greenfield.",
    tags: ["BSC", "Greenfield", "AI", "MCP", "TypeScript"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/typescript/bnbchain-mcp",
    featured: true,
  },
  {
    title: "BNB Chain LangChain AgentKit",
    description: "Create an AI agent using the BNB Chain plugin for LangChain AI.",
    tags: ["BSC", "opBNB", "AI"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/python/langchain-chatbot",
    featured: true,
  },
  {
    title: "EIP 7702 - Demo",
    description:
      "Implementation demo of EIP-7702 (Account Abstraction via Authorized Operations) on BNB Smart Chain.",
    tags: ["BSC", "Account Abstraction", "Go"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/go/eip7702-demo",
    featured: true,
  },
  {
    title: "PancakeSwap Python Frontend + API Swap Example",
    description:
      "Swap tBNB to tokens or BEP-20 to BEP-20 with Flask API and Trust Wallet-enabled frontend on BNB Testnet.",
    tags: ["BSC", "opBNB", "Web3", "Python", "Flask", "PancakeSwap", "TrustWallet"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/python/pancake-swap-example",
    featured: true,
  },
  {
    title: "4EVERLAND Hosting MCP - AI-Powered Hosting Assistant",
    description:
      "Deploy dApps to decentralized networks like Greenfield, IPFS, and Arweave with a simple AI chat interface.",
    tags: ["Greenfield", "AI", "TypeScript"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/typescript/4everland-hosting-mcp",
  },
  {
    title: "A Step-by-Step Guide to Bridging Assets from BSC to opBNB",
    description: "Guide for seamless cross-chain transfer of assets from BSC to opBNB.",
    tags: ["opBNB", "Guide"],
    link: "https://www.bnbchain.org/en/blog/a-step-by-step-guide-to-bridging-assets-from-bsc-to-opbnb",
  },
  {
    title: "AI-Powered Reputation NFT Badges on BNB Chain",
    description:
      "Generate wallet-based reputation insights with AI and mint soulbound ERC-721 badges with IPFS metadata.",
    tags: ["BSC", "AI", "NFT", "Python"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/python/ai-wallet-reputation-nft",
  },
  {
    title: "BNB Chain Chatbot with UI (Python)",
    description:
      "Web UI + API wrapper example for integrating BNB Chain LangChain AgentKit chatbot into dApps.",
    tags: ["BSC", "opBNB", "AI", "ChatBot", "Python"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/python/chatbot-with-ui",
  },
  {
    title: "BNB Chain Eliza AgentKit",
    description: "Build AI agents using the BNB Chain plugin for Eliza AI.",
    tags: ["BSC", "opBNB", "AI"],
    link: "https://github.com/bnb-chain",
  },
  {
    title: "BNB Migration Video Guide",
    description: "BNB migration walkthrough with ecosystem context around BC Fusion and staking.",
    tags: ["Infrastructure", "BC Fusion", "Staking"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "Chainsub – Minimal Smart Contract Event Listener",
    description:
      "A lightweight CLI and Go package to subscribe and monitor EVM smart contract events.",
    tags: ["BSC", "Event Listener", "CLI", "Go"],
    link: "https://github.com/bnb-chain/example-hub/tree/main/go/event-listener",
  },
  {
    title: "How to Minimize Gas Fees: User Interactions Layer on opBNB",
    description: "Use case guide on reducing costs for frequent on-chain interactions on opBNB.",
    tags: ["Web3", "opBNB", "Optimization"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "How to Transition from Amazon S3 to Greenfield",
    description: "Practical migration path from centralized cloud storage to decentralized BNB Greenfield.",
    tags: ["Greenfield", "Storage", "Guide"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "Navigating The Guide and Support For Building on opBNB",
    description: "Collection of tutorials and support paths for builders shipping on opBNB.",
    tags: ["opBNB", "Builder Support"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "Safeguarding Your Web3 Journey: The HashDit Extension",
    description: "Security extension for safer interactions with digital-asset websites.",
    tags: ["Security", "Extension"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "Telegram Token Launch & Faucet Demo",
    description:
      "Go backend + Telegram bot to deploy BEP-20 tokens, send faucet tokens, and check balances on BNB Testnet.",
    tags: ["BSC", "BNB Chain", "Telegram Bot", "Web3", "Golang", "Smart Contracts", "BEP-20"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "The BNB Chain Beacon Chain Migration Guidance",
    description: "Migration guidance for BC Fusion and retirement of Beacon Chain functions.",
    tags: ["BC Fusion", "Staking", "Migration"],
    link: "https://www.bnbchain.org",
  },
  {
    title: "Your Guide to Creating BEP-20 Tokens on BNB Smart Chain",
    description: "Beginner to advanced guidance for token creation patterns and security considerations.",
    tags: ["BSC", "BEP-20", "Guide"],
    link: "https://www.bnbchain.org",
  },
]
