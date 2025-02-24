import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify";


const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_ID = process.env.ETHERSCAN_ID || ""


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
  	sepolia: {
  		url: SEPOLIA_RPC_URL,
  		accounts: [`0x${PRIVATE_KEY}`],
  		chainId: 11155111,
  	},
  	localhost: {
  		url: "http://localhost:8545",
  		chainId: 31337
  	}
  },
  etherscan: {
  	apiKey: ETHERSCAN_ID
  },
  solidity: {
  	compilers: [
	  	{
	  		version: "0.8.28"
	  	}
  	]
  },
  sourcify: {
	enabled: true
  }
};

export default config;
