import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.18",

  networks:{
    ethereum: {
      url: process.env.ETHEREUM_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY]
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

export default config;
