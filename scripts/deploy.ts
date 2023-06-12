import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  
  //Token ETH
  const TokenETH = await ethers.getContractFactory("TokenETH", owner);
  const tokenETH = await TokenETH.deploy();

  await tokenETH.deployed();

  //Token Poly
  const TokenPOLY = await ethers.getContractFactory("TokenPOLY", owner);
  const tokenPOLY = await TokenPOLY.deploy();

  await tokenPOLY.deployed();
  
  //Bridge ETH
  const BridgeETH = await ethers.getContractFactory("BridgeETH", owner);
  const bridgeETH = await BridgeETH.deploy();

  await bridgeETH.deployed();

  //Bridge POLY
  const BridgePOLY = await ethers.getContractFactory("BridgePOLY", owner);
  const bridgePOLY = await BridgePOLY.deploy();

  await bridgePOLY.deployed();

  //Addresses of contracts
  console.log("TokenETH address: " + tokenETH.address);
  console.log("TokenPOLY address: " + tokenPOLY.address);
  console.log("BridgeETH address: " + bridgeETH.address);
  console.log("BridgePOLY address: " + bridgePOLY.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
