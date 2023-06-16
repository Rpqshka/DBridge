import { ethers } from "hardhat";

async function main() {
  //Token POLY
  const tokenPOLY = await ethers.deployContract("TokenPOLY");
  await tokenPOLY.waitForDeployment();

  //Bridge POLY
  const bridgePOLY = await ethers.deployContract("BridgePOLY", [await tokenPOLY.getAddress()],);
  await bridgePOLY.waitForDeployment();

  //Addresses of contracts
  console.log("TokenPOLY address: " + await tokenPOLY.getAddress());
  console.log("BridgePOLY address: " + await bridgePOLY.getAddress());
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
