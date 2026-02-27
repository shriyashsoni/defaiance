import { ethers } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying StartupPoolFactory with:", deployer.address)

  const Factory = await ethers.getContractFactory("StartupPoolFactory")
  const factory = await Factory.deploy(deployer.address)
  await factory.waitForDeployment()

  const address = await factory.getAddress()
  console.log("StartupPoolFactory deployed:", address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
