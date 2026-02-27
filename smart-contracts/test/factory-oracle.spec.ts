import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Factory and oracle contracts", function () {
  it("StartupPoolFactory: creates pools and stores metadata", async function () {
    const [admin, manager] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("StartupPoolFactory");
    const factory = await Factory.deploy(admin.address);

    await factory.connect(admin).createPool(ethers.ZeroAddress, manager.address, "Native Pool", "NPOOL");

    expect(await factory.poolsCount()).to.equal(1n);

    const poolAddress = await factory.allPools(0);
    const poolMeta = await factory.poolInfo(poolAddress);

    expect(poolMeta.pool).to.equal(poolAddress);
    expect(poolMeta.asset).to.equal(ethers.ZeroAddress);
    expect(poolMeta.name).to.equal("Native Pool");

    await expect(factory.connect(manager).createPool(ethers.ZeroAddress, manager.address, "x", "x")).to.be.reverted;
  });

  it("OracleAdapter: updates prices and rejects stale/nonexistent prices", async function () {
    const [admin, updater, outsider] = await ethers.getSigners();

    const Oracle = await ethers.getContractFactory("OracleAdapter");
    const oracle = await Oracle.deploy(admin.address, updater.address, 60);

    const pairId = ethers.id("BNB_USDT");

    await expect(oracle.getPrice(pairId)).to.be.reverted;
    await expect(oracle.connect(outsider).setPrice(pairId, 700_000_000n)).to.be.reverted;

    await oracle.connect(updater).setPrice(pairId, 700_000_000n);
    const [price] = await oracle.getPrice(pairId);
    expect(price).to.equal(700_000_000n);

    await time.increase(61);
    await expect(oracle.getPrice(pairId)).to.be.reverted;
  });
});
