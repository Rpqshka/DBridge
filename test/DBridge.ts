import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DBridge", function () {

  async function deployAllContracts() {
    const [owner, alice] = await ethers.getSigners();

    const tokenETH = await ethers.deployContract("TokenETH");
    await tokenETH.waitForDeployment();

    const tokenPOLY = await ethers.deployContract("TokenPOLY");
    await tokenPOLY.waitForDeployment();

    const bridgeETH = await ethers.deployContract("BridgeETH", [await tokenETH.getAddress()]);
    await bridgeETH.waitForDeployment();

    const bridgePOLY = await ethers.deployContract("BridgePOLY", [await tokenPOLY.getAddress()],);
    await bridgePOLY.waitForDeployment();


    return { tokenETH, tokenPOLY, bridgeETH, bridgePOLY, owner, alice };
  }


  describe("Tokens", function () {

    it("Should be successfully deployed token contracts", async function () {
      const { tokenETH, tokenPOLY, owner } = await loadFixture(deployAllContracts);

      //TokenETH
      expect(await tokenETH.name()).to.equal("TokenETH");
      expect(await tokenETH.symbol()).to.equal("TKNE");
      expect(await tokenETH.admins(owner.address)).to.equal(true);
      expect(await tokenETH.totalSupply()).to.equal(0);

      //TokenPOLY
      expect(await tokenPOLY.name()).to.equal("TokenPOLY");
      expect(await tokenPOLY.symbol()).to.equal("TKNP");
      expect(await tokenPOLY.admins(owner.address)).to.equal(true);
      expect(await tokenPOLY.totalSupply()).to.equal(0);
    });

    it("Should be a successful mint only by the owner of the contracts", async function () {
      const { tokenETH, tokenPOLY, owner, alice } = await loadFixture(deployAllContracts);

      //TokenETH
      expect(await tokenETH.totalSupply()).to.be.equal(0);
      expect(await tokenETH.balanceOf(owner.address)).to.be.equal(0);
      await tokenETH.mint(owner.address, 100)
      expect(await tokenETH.totalSupply()).to.be.equal(100);
      expect(await tokenETH.balanceOf(owner.address)).to.be.equal(100);

      expect(await tokenETH.balanceOf(alice.address)).to.be.equal(0);
      try {
        await tokenETH.connect(alice).mint(alice.address, 200);
      }
      catch (err) {
        expect(err.message).to.be.include("Only admin");
      }
      expect(await tokenETH.balanceOf(alice.address)).to.be.equal(0);

      //TokenPOLY
      expect(await tokenPOLY.totalSupply()).to.be.equal(0);
      expect(await tokenPOLY.balanceOf(owner.address)).to.be.equal(0);
      await tokenPOLY.mint(owner.address, 100)
      expect(await tokenPOLY.totalSupply()).to.be.equal(100);
      expect(await tokenPOLY.balanceOf(owner.address)).to.be.equal(100);

      expect(await tokenPOLY.balanceOf(alice.address)).to.be.equal(0);
      try {
        await tokenPOLY.connect(alice).mint(alice.address, 200);
      }
      catch (err) {
        expect(err.message).to.be.include("Only admin");
      }
      expect(await tokenPOLY.balanceOf(alice.address)).to.be.equal(0);
    });

    it("Should be a successful burn only by the owner of the contracts", async function () {
      const { tokenETH, tokenPOLY, owner, alice } = await loadFixture(deployAllContracts);

      //TokenETH
      await tokenETH.mint(owner.address, 100)
      await tokenETH.mint(alice.address, 100)
      expect(await tokenETH.totalSupply()).to.be.equal(200);

      await tokenETH.burnToken(owner.address, 100);
      expect(await tokenETH.balanceOf(owner.address)).to.be.equal(0);
      expect(await tokenETH.totalSupply()).to.be.equal(100);

      await tokenETH.burnToken(alice.address, 50);
      expect(await tokenETH.balanceOf(alice.address)).to.be.equal(50);
      expect(await tokenETH.totalSupply()).to.be.equal(50);

      try {
        await tokenETH.connect(alice).burnToken(alice.address, 50);
      }
      catch (err) {
        expect(err.message).to.be.include("Only admin");
      }
      expect(await tokenETH.balanceOf(alice.address)).to.be.equal(50);
      expect(await tokenETH.totalSupply()).to.be.equal(50);

      //TokenPoly
      await tokenPOLY.mint(owner.address, 100)
      await tokenPOLY.mint(alice.address, 100)
      expect(await tokenPOLY.totalSupply()).to.be.equal(200);

      await tokenPOLY.burnToken(owner.address, 100);
      expect(await tokenPOLY.balanceOf(owner.address)).to.be.equal(0);
      expect(await tokenPOLY.totalSupply()).to.be.equal(100);

      await tokenPOLY.burnToken(alice.address, 50);
      expect(await tokenPOLY.balanceOf(alice.address)).to.be.equal(50);
      expect(await tokenPOLY.totalSupply()).to.be.equal(50);

      try {
        await tokenPOLY.connect(alice).burnToken(alice.address, 50);
      }
      catch (err) {
        expect(err.message).to.be.include("Only admin");
      }
      expect(await tokenPOLY.balanceOf(alice.address)).to.be.equal(50);
      expect(await tokenPOLY.totalSupply()).to.be.equal(50);
    });

    it("Should be successfully added a new admin", async function () {
      const { tokenETH, tokenPOLY, bridgeETH, bridgePOLY, owner } = await loadFixture(deployAllContracts);

      //TokenETH
      expect(await tokenETH.admins(owner.address)).to.be.equal(true);
      expect(await tokenETH.admins(await bridgeETH.getAddress())).to.be.equal(false);

      await tokenETH.addAdmin(await bridgeETH.getAddress());
      expect(await tokenETH.admins(await bridgeETH.getAddress())).to.be.equal(true);

      //TokenPOLY
      expect(await tokenPOLY.admins(owner.address)).to.be.equal(true);
      expect(await tokenPOLY.admins(await bridgePOLY.getAddress())).to.be.equal(false);

      await tokenPOLY.addAdmin(await bridgePOLY.getAddress());
      expect(await tokenPOLY.admins(await bridgePOLY.getAddress())).to.be.equal(true);
    });
  });

  describe("Bridges", function () {
    it("Should be successfully transfer token from ETH to POLY chain and POLY to ETH", async function () {
      const { tokenETH, tokenPOLY, bridgeETH, bridgePOLY, owner } = await loadFixture(deployAllContracts);

      await tokenETH.addAdmin(await bridgeETH.getAddress());
      await tokenPOLY.addAdmin(await bridgePOLY.getAddress());

      await tokenETH.mint(owner.address, 100);
      expect(await tokenETH.balanceOf(owner.address)).to.be.equal(100);
      await tokenPOLY.mint(owner.address, 100);
      expect(await tokenPOLY.balanceOf(owner.address)).to.be.equal(100);

      await bridgeETH.burn(owner.address, 40);
      expect(await tokenETH.balanceOf(owner.address)).to.be.equal(60);
      await bridgePOLY.mint(owner.address, 40, 0);
      expect(await tokenPOLY.balanceOf(owner.address)).to.be.equal(140);
      
      await bridgePOLY.burn(owner.address, 100);
      expect(await tokenPOLY.balanceOf(owner.address)).to.be.equal(40);
      await bridgeETH.mint(owner.address, 100, 0);
      expect(await tokenETH.balanceOf(owner.address)).to.be.equal(160);
    });
  });


});
