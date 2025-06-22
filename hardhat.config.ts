import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-chai-matchers";
import "@tenderly/hardhat-tenderly";
import "@nomicfoundation/hardhat-verify";

import * as dotenv from "dotenv";
dotenv.config();

 
const config: HardhatUserConfig = {
  networks: {
      sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun", // Add this to target Cancun EVM
    },
  },
  tenderly: {
    project: "project/z",
    username: "mingderwang2",
    privateVerification: false, // Public verification
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY, // Replace with your Etherscan API key
    },
  },
};

console.log("Tenderly Config:", config.tenderly); // Debug log


export default config;
