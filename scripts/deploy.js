// import { ethers } from "hardhat";
// import { parse } from 'node-html-parser';
// ethers = require('hardhat');
const hre = require("hardhat");
async function staking() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();
  
    console.log("Staking address:", staking.address);
  }
  
  async function main() {
    staking()
  }

  async function rewardToken() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy();
  
    console.log("RewardToken address:", rewardToken.address);
  }

  async function rewardNFT() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const RewardNft = await ethers.getContractFactory("RewardNFT");
    const rewardNFT = await RewardNft.deploy();
    console.log("REwardNft address:", rewardNFT.address);
  }

  async function demo(){
    const[deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const Demo = await ethers.getContractFactory("Demo");
    const demo = await Demo.deploy();
    console.log("demo address:", demo.address);
  }


  
  async function main() {
    staking()
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });