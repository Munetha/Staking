require("@nomicfoundation/hardhat-toolbox");

const GEORLI_RPC = "https://eth-goerli.g.alchemy.com/v2/d976tGIQLf0bYtN2nXYAR5gvYEPhppcO";
const PRIVATE_KEY = "8184de675adc0c2f224e9fcc4cc18e8d9948084471082289c28d7c59129a7703";

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
    },
    ganache:{
      url: "HTTP://127.0.0.1:7545",
      //accounts: [PRIVATE_KEY],
      chainId: 1337,
    }
  }
};
