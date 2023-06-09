import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: ".env" });

const ALCHEMY_GOERLI_API_KEY_URL = process.env.GOERLI_API;

const MUMBAI_URL = process.env.MUMBAI_API;

const ACCOUNT_PRIVATE_KEY = process.env.SECRET;

module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {},
    mumbai: {
      url : MUMBAI_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
    goerli: {
      url: ALCHEMY_GOERLI_API_KEY_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: {
            polygonMumbai: "1PUJPJGSC1I7S7CPZVBQE8N5BB1A3ZK5RN"
          }
  },
  blockGasLimit: 200000000000,
  gasPrice: 10000000000,
};