import { ethers } from "hardhat";

async function main() {
  //Token ETH
  const tokenETH = await ethers.deployContract("TokenETH");
  await tokenETH.waitForDeployment();
  
  //Bridge ETH
  const bridgeETH = await ethers.deployContract("BridgeETH", [await tokenETH.getAddress()]);
  await bridgeETH.waitForDeployment();

  //Addresses of contracts
  console.log("TokenETH address: " + await tokenETH.getAddress());
  console.log("BridgeETH address: " + await bridgeETH.getAddress());
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
