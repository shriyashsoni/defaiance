import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545";
const BSC_MAINNET_RPC_URL = process.env.BSC_MAINNET_RPC_URL || "https://bsc-dataseed.binance.org";

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    bscTestnet: {
      url: BSC_TESTNET_RPC_URL,
      chainId: 97,
      accounts
    },
    bscMainnet: {
      url: BSC_MAINNET_RPC_URL,
      chainId: 56,
      accounts
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY || ""
  }
};

export default config;
