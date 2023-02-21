require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const GEORLI_RPC = process.env.GEORLI_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks:{
    georli:{
      url: GEORLI_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 5
    }
  }
};
