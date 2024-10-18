require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",  // Updated to match OpenZeppelin contracts
  networks: {
    sepolia: {
      url: process.env.INFURA_NETWORK,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
