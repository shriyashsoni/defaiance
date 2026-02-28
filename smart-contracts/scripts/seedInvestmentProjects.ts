import { ethers } from "hardhat"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const FACTORY_ADDRESS = "0x5cd6085759F2a378FD227Be036126009FBaCBDCD"

const PROJECTS: Array<{ name: string; symbol: string }> = [
  { name: "BNBChain MCP", symbol: "BMCP" },
  { name: "LangChain AgentKit", symbol: "LCAK" },
  { name: "EIP7702 Demo", symbol: "E7702" },
  { name: "PancakeSwap API Swap", symbol: "PSWP" },
  { name: "4EVERLAND Hosting MCP", symbol: "4ELM" },
  { name: "Bridge BSC to opBNB", symbol: "BRDG" },
  { name: "AI Reputation NFT", symbol: "ARNFT" },
  { name: "Chatbot UI Python", symbol: "CBOT" },
  { name: "Eliza AgentKit", symbol: "ELZA" },
  { name: "Chainsub Event Listener", symbol: "CSUB" },
  { name: "HashDit Security Extension", symbol: "HDIT" },
  { name: "Telegram Token Faucet", symbol: "TGTF" },
]

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Seeding projects with:", deployer.address)

  const factory = await ethers.getContractAt("StartupPoolFactory", FACTORY_ADDRESS)
  const existingCount = Number(await factory.poolsCount())

  const existingNames = new Set<string>()
  for (let i = 0; i < existingCount; i++) {
    const address = await factory.allPools(i)
    const info = await factory.poolInfo(address)
    existingNames.add(String(info.name).toLowerCase())
  }

  for (const project of PROJECTS) {
    if (existingNames.has(project.name.toLowerCase())) {
      console.log(`Skipping existing pool: ${project.name}`)
      continue
    }

    const tx = await factory.createPool(ZERO_ADDRESS, deployer.address, project.name, project.symbol)
    const receipt = await tx.wait()
    console.log(`Created: ${project.name} (${project.symbol}) tx=${receipt?.hash}`)
  }

  console.log("Seed completed")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
