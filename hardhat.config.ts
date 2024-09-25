import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-foundry"
import "@nomicfoundation/hardhat-verify"
import "@tenderly/hardhat-tenderly"
import * as tdly from "@tenderly/hardhat-tenderly"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/types"
import "hardhat-contract-sizer"
import "solidity-coverage"
import "solidity-docgen"
import dotenv from "dotenv";

dotenv.config();

const {
  MAINNET_URL = "https://eth-mainnet",
  MAINNET_PRIVATEKEY = "0xkey",
  SEPOLIA_URL = "https://eth-sepolia",
  SEPOLIA_PRIVATEKEY = "0xkey",
  TENDERLY_URL = "https://eth-tenderly",
  TENDERLY_PRIVATEKEY = "0xkey",
  USE_TENDERLY = process.env.USE_TENDERLY === "true",
  ETHERSCAN_API_KEY = "key",
  COINMARKETCAP_API_KEY = "key",
} = process.env;

if (USE_TENDERLY) {
  tdly.setup({ automaticVerifications: true });
}

/** @type {import('hardhat/config').HardhatUserConfig} */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.23" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  defaultNetwork: "tenderly",
  networks: {
    hardhat: { chainId: 31337 },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    mainnet: {
      chainId: 1,
      url: MAINNET_URL,
      accounts: [MAINNET_PRIVATEKEY],
    },
    tenderly: USE_TENDERLY ? {
      chainId: 11155111,
      url: TENDERLY_URL,
      accounts: [TENDERLY_PRIVATEKEY],
    } : undefined,
    sepolia: !USE_TENDERLY ? {
      chainId: 11155111,
      url: SEPOLIA_URL,
      accounts: [SEPOLIA_PRIVATEKEY],
    } : undefined,
  },
  namedAccounts: {
    deployer: { default: 0 },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  mocha: { timeout: 20_000 },
  etherscan: { apiKey: ETHERSCAN_API_KEY },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
  docgen: {
    outputDir: "./docs",
    pages: "files"
  }
};

export default config;
