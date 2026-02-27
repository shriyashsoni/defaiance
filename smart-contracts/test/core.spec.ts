import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Core contracts", function () {
  it("DefaianceToken: mints initial supply and enforces minter role", async function () {
    const [admin, treasury, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DefaianceToken");
    const token = await Token.deploy(admin.address, treasury.address, ethers.parseEther("1000"));

    expect(await token.balanceOf(treasury.address)).to.equal(ethers.parseEther("1000"));

    await expect(token.connect(user).mint(user.address, ethers.parseEther("1"))).to.be.reverted;

    await token.connect(admin).mint(user.address, ethers.parseEther("10"));
    expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("10"));
  });

  it("TreasuryVault: deposits/withdrawals work with role checks", async function () {
    const [admin, treasurer, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DefaianceToken");
    const token = await Token.deploy(admin.address, admin.address, ethers.parseEther("1000"));

    const Treasury = await ethers.getContractFactory("TreasuryVault");
    const vault = await Treasury.deploy(admin.address, treasurer.address);

    await token.connect(admin).mint(user.address, ethers.parseEther("100"));
    await token.connect(user).approve(await vault.getAddress(), ethers.parseEther("50"));
    await vault.connect(user).depositToken(await token.getAddress(), ethers.parseEther("50"));

    expect(await token.balanceOf(await vault.getAddress())).to.equal(ethers.parseEther("50"));

    await expect(
      vault.connect(user).withdrawToken(await token.getAddress(), user.address, ethers.parseEther("1"))
    ).to.be.reverted;

    await vault.connect(treasurer).withdrawToken(await token.getAddress(), user.address, ethers.parseEther("20"));
    expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("70"));

    await user.sendTransaction({ to: await vault.getAddress(), value: ethers.parseEther("1") });
    await expect(vault.connect(treasurer).withdrawNative(user.address, ethers.parseEther("0.5"))).to.not.be.reverted;
  });

  it("InvestmentPool: share accounting + manager yield + pause protection", async function () {
    const [admin, manager, alice, bob] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DefaianceToken");
    const token = await Token.deploy(admin.address, admin.address, ethers.parseEther("100000"));

    const Pool = await ethers.getContractFactory("InvestmentPool");
    const pool = await Pool.deploy(await token.getAddress(), admin.address, manager.address, "Pool", "POOL");

    await token.connect(admin).mint(alice.address, ethers.parseEther("1000"));
    await token.connect(admin).mint(bob.address, ethers.parseEther("1000"));
    await token.connect(admin).mint(manager.address, ethers.parseEther("1000"));

    await token.connect(alice).approve(await pool.getAddress(), ethers.parseEther("100"));
    await pool.connect(alice).deposit(ethers.parseEther("100"));
    expect(await pool.sharesOf(alice.address)).to.equal(ethers.parseEther("100"));

    await token.connect(manager).approve(await pool.getAddress(), ethers.parseEther("50"));
    await pool.connect(manager).addYield(ethers.parseEther("50"));

    await token.connect(bob).approve(await pool.getAddress(), ethers.parseEther("150"));
    await pool.connect(bob).deposit(ethers.parseEther("150"));

    expect(await pool.totalShares()).to.equal(ethers.parseEther("200"));
    expect(await pool.accountedAssets()).to.equal(ethers.parseEther("300"));

    await expect(pool.connect(bob).recordLoss(ethers.parseEther("1"))).to.be.reverted;

    await pool.connect(admin).pause();
    await expect(pool.connect(alice).withdraw(ethers.parseEther("10"))).to.be.reverted;
    await pool.connect(admin).unpause();

    await pool.connect(alice).withdraw(ethers.parseEther("100"));
    expect(await token.balanceOf(alice.address)).to.equal(ethers.parseEther("1050"));
  });

  it("MarketplaceEscrow: create/release/dispute/resolve paths", async function () {
    const [admin, arbiter, buyer, seller] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("MarketplaceEscrow");
    const escrow = await Escrow.deploy(admin.address, arbiter.address);

    const deadline = (await time.latest()) + 3600;
    await escrow.connect(buyer).createEscrow(seller.address, ethers.ZeroAddress, ethers.parseEther("1"), deadline, {
      value: ethers.parseEther("1")
    });

    await expect(escrow.connect(seller).release(0)).to.be.reverted;
    await escrow.connect(buyer).release(0);

    const deal0 = await escrow.deals(0);
    expect(deal0.released).to.equal(true);

    const deadline2 = (await time.latest()) + 3600;
    await escrow.connect(buyer).createEscrow(seller.address, ethers.ZeroAddress, ethers.parseEther("2"), deadline2, {
      value: ethers.parseEther("2")
    });

    await escrow.connect(seller).raiseDispute(1);
    await escrow.connect(arbiter).resolveDispute(1, ethers.parseEther("0.5"));

    const deal1 = await escrow.deals(1);
    expect(deal1.resolved).to.equal(true);
  });
});
