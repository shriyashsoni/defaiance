import { expect } from "chai";
import { ethers } from "hardhat";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";

describe("Governance and rewards contracts", function () {
  it("DefaianceDAO: proposal lifecycle and execution", async function () {
    const [admin, proposer, voter, executor] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DefaianceToken");
    const token = await Token.deploy(admin.address, admin.address, ethers.parseEther("1000000"));

    await token.connect(admin).mint(proposer.address, ethers.parseEther("2000"));
    await token.connect(admin).mint(voter.address, ethers.parseEther("2000"));

    await token.connect(proposer).delegate(proposer.address);
    await token.connect(voter).delegate(voter.address);

    await mine(2);

    const MockTarget = await ethers.getContractFactory("OracleAdapter");
    const target = await MockTarget.deploy(admin.address, admin.address, 3600);

    const DAO = await ethers.getContractFactory("DefaianceDAO");
    const dao = await DAO.deploy(admin.address, await token.getAddress(), ethers.parseEther("1000"), 1, 5, 1, 10);

    const EXECUTOR_ROLE = await dao.EXECUTOR_ROLE();
    await dao.connect(admin).grantRole(EXECUTOR_ROLE, executor.address);

    const pairId = ethers.id("BNB_USDT");
    const callData = target.interface.encodeFunctionData("setMaxPriceAge", [7200]);

    await dao.connect(proposer).propose(await target.getAddress(), 0, callData, "Increase max age");

    expect(await dao.state(1)).to.equal(0n);

    await mine(2);
    expect(await dao.state(1)).to.equal(1n);

    await dao.connect(proposer).castVote(1, 1);
    await dao.connect(voter).castVote(1, 1);

    await expect(dao.connect(voter).castVote(1, 1)).to.be.reverted;

    await mine(6);
    expect(await dao.state(1)).to.equal(2n);

    await dao.queue(1);
    expect(await dao.state(1)).to.equal(4n);

    await time.increase(11);
    await dao.connect(executor).execute(1);

    expect(await dao.state(1)).to.equal(5n);
    expect(await target.maxPriceAge()).to.equal(7200n);

    await expect(dao.connect(proposer).propose(ethers.ZeroAddress, 0, "0x", "bad")).to.be.reverted;

    void pairId;
  });

  it("StakingRewards: stake, accrue rewards, claim, and exit", async function () {
    const [admin, distributor, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DefaianceToken");
    const token = await Token.deploy(admin.address, admin.address, ethers.parseEther("1000000"));

    await token.connect(admin).mint(user.address, ethers.parseEther("1000"));
    await token.connect(admin).mint(distributor.address, ethers.parseEther("1000"));

    const Staking = await ethers.getContractFactory("StakingRewards");
    const staking = await Staking.deploy(admin.address, distributor.address, await token.getAddress(), await token.getAddress());

    await token.connect(user).approve(await staking.getAddress(), ethers.parseEther("100"));
    await staking.connect(user).stake(ethers.parseEther("100"));

    await token.connect(distributor).approve(await staking.getAddress(), ethers.parseEther("500"));
    await staking.connect(distributor).notifyRewardAmount(ethers.parseEther("500"), 1000);

    await time.increase(200);

    const earned = await staking.earned(user.address);
    expect(earned).to.be.gt(0);

    await staking.connect(user).getReward();
    const balAfterReward = await token.balanceOf(user.address);
    expect(balAfterReward).to.be.gt(ethers.parseEther("900"));

    await staking.connect(user).exit();
    expect(await staking.balanceOf(user.address)).to.equal(0n);
  });

  it("TokenVesting: create schedule, release over time, revoke with refund", async function () {
    const [admin, treasury, beneficiary] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DefaianceToken");
    const token = await Token.deploy(admin.address, admin.address, ethers.parseEther("1000000"));

    const Vesting = await ethers.getContractFactory("TokenVesting");
    const vesting = await Vesting.deploy(admin.address, await token.getAddress(), treasury.address);

    await token.connect(admin).approve(await vesting.getAddress(), ethers.parseEther("1000"));

    const start = BigInt((await time.latest()) + 10);
    await vesting.connect(admin).createSchedule(beneficiary.address, ethers.parseEther("1000"), start, 100, 1000, true);

    await expect(vesting.connect(beneficiary).release()).to.be.reverted;

    await time.increaseTo(Number(start + 500n));
    const releasable = await vesting.releasableAmount(beneficiary.address);
    expect(releasable).to.be.gt(0);

    await vesting.connect(beneficiary).release();
    const releasedBal = await token.balanceOf(beneficiary.address);
    expect(releasedBal).to.be.gt(0);

    const treasuryBalBefore = await token.balanceOf(treasury.address);
    await vesting.connect(admin).revoke(beneficiary.address);
    const treasuryBalAfter = await token.balanceOf(treasury.address);

    expect(treasuryBalAfter).to.be.gt(treasuryBalBefore);
  });
});
