const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Staking', () => {
    let deployer;
    let staker;
    
    let staking ;
let erc20 ;
let erc721 ;
let demoErc20 ;

const deployStaking = async() => {
    const StakingFactory = await ethers.getContractFactory('Staking');
    const Staking = await StakingFactory.deploy();
    staking = await Staking.deployed();
};

const deployErc20 = async() => {
    const RewardTokenFactory = await ethers.getContractFactory('RewardToken');
    const RewardToken = await RewardTokenFactory.deploy(staking.address);
    erc20 = await RewardToken.deployed();
};

const deployErc721 = async() => {
    const RewardNFTFactory = await ethers.getContractFactory('RewardNFT');
    const RewardNFT = await RewardNFTFactory.deploy(staking.address);
    erc721 = await RewardNFT.deployed();
};

const deployDemo = async() => {
    const DemoFactory = await ethers.getContractFactory('Demo');
    const Demo = await DemoFactory.deploy();
    demoErc20 = await Demo.deployed();
};

    before(async () => {
        signers = await ethers.getSigners();

        deployer = signers[0];
        staker = signers[1];

        await deployStaking();
        await deployErc20();
        await deployErc721();
        await deployDemo();
    });

    it('set reward contract address in staking', async () => {
       
    });

    it('mint demo token and set allowance', async () => {
       
    });

    it('deposit token', async () => {
       
    });

    it('check staking status', async () => {
       
    });

    it('withdraw token', async () => {
       
    });

    it('check staking status after withdraw', async () => {
       
    });

    it('clain reward', async () => {
       
    });

    it('check staking status after claim', async () => {
       
    });
});
