import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;

  console.log(`Deploying with: ${deployer.address}`);
  console.log(`Treasury address: ${treasuryAddress}`);

  const Token = await ethers.getContractFactory("DefaianceToken");
  const token = await Token.deploy(deployer.address, treasuryAddress, ethers.parseEther("1000000000"));
  await token.waitForDeployment();

  const Treasury = await ethers.getContractFactory("TreasuryVault");
  const treasury = await Treasury.deploy(deployer.address, deployer.address);
  await treasury.waitForDeployment();

  const PoolFactory = await ethers.getContractFactory("StartupPoolFactory");
  const poolFactory = await PoolFactory.deploy(deployer.address);
  await poolFactory.waitForDeployment();

  const Escrow = await ethers.getContractFactory("MarketplaceEscrow");
  const escrow = await Escrow.deploy(deployer.address, deployer.address);
  await escrow.waitForDeployment();

  const Oracle = await ethers.getContractFactory("OracleAdapter");
  const oracle = await Oracle.deploy(deployer.address, deployer.address, 3600);
  await oracle.waitForDeployment();

  const DAO = await ethers.getContractFactory("DefaianceDAO");
  const dao = await DAO.deploy(
    deployer.address,
    await token.getAddress(),
    ethers.parseEther("100000"),
    100,
    28800,
    400,
    86400
  );
  await dao.waitForDeployment();

  const Staking = await ethers.getContractFactory("StakingRewards");
  const staking = await Staking.deploy(
    deployer.address,
    deployer.address,
    await token.getAddress(),
    await token.getAddress()
  );
  await staking.waitForDeployment();

  const Vesting = await ethers.getContractFactory("TokenVesting");
  const vesting = await Vesting.deploy(deployer.address, await token.getAddress(), treasuryAddress);
  await vesting.waitForDeployment();

  const addresses = {
    DefaianceToken: await token.getAddress(),
    TreasuryVault: await treasury.getAddress(),
    StartupPoolFactory: await poolFactory.getAddress(),
    MarketplaceEscrow: await escrow.getAddress(),
    OracleAdapter: await oracle.getAddress(),
    DefaianceDAO: await dao.getAddress(),
    StakingRewards: await staking.getAddress(),
    TokenVesting: await vesting.getAddress()
  };

  console.log("Deployment complete:");
  console.table(addresses);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
