require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const GEORLI_RPC = process.env.GEORLI_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;
const POLYGON_MUMBAI_URL = process.env.POLYGON_MUMBAI_URL;

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
  networks: {
    georli: {
      url: GEORLI_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 5
    },
<<<<<<< HEAD
    ganache:{
      url: "HTTP://127.0.0.1:7545",
      //accounts: [PRIVATE_KEY],
      chainId: 1337,
    }
=======
    localhost: {
      url:LOCAL_HOST_URL,
      chainid: 31337,
    },
    polygon_mumbai: {
      url:POLYGON_MUMBAI_URL,
      accounts: [PRIVATE_KEY],
    },
>>>>>>> 84f3f771a672136b1aec106d0e3515fb2e9d78f9
  }
};
