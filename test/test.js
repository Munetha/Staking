const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
import { time } from "@nomicfoundation/hardhat-network-helpers";


describe('Staking', () => {
    let deployer;
    let staker;

    let staking;
    let erc20;
    let erc721;
    let demoErc20;

    const deployStaking = async () => {
        const StakingFactory = await ethers.getContractFactory('Staking');
        const Staking = await StakingFactory.deploy();
        staking = await Staking.deployed();
    };

    const deployErc20 = async () => {
        const RewardTokenFactory = await ethers.getContractFactory('RewardToken');
        const RewardToken = await RewardTokenFactory.deploy(staking.address);
        erc20 = await RewardToken.deployed();
    };

    const deployErc721 = async () => {
        const RewardNFTFactory = await ethers.getContractFactory('RewardNFT');
        const RewardNFT = await RewardNFTFactory.deploy(staking.address);
        erc721 = await RewardNFT.deployed();
    };

    const deployDemo = async () => {
        const DemoFactory = await ethers.getContractFactory('Demo');
        const Demo = await DemoFactory.deploy();
        demoErc20 = await Demo.deployed();
    };

    beforeEach(async () => {
        signers = await ethers.getSigners();

        deployer = signers[0];
        staker = signers[1];

        await deployStaking();
        await deployErc20();
        await deployErc721();
        await deployDemo();
    });

    it('set reward contract address in staking', async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        let erc20Address = await staking.connect(staker).Erc20();
        let nftAddress = await staking.connect(staker).nft();
        assert.equal(erc20Address,erc20.address);
        assert.equal(nftAddress,erc721.address);

    });

    it('mint demo token and set allowance', async () => {
        await demoErc20.connect(deployer).mint(staker.address,1000);
        await demoErc20.connect(staker).approve(staking.address,1000);
        let allowance = await demoErc20.connect(staker).allowance(staker.address,staking.address);
        assert.equal(allowance,1000);
    });

    it('deposit token', async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);        
        await demoErc20.connect(deployer).mint(staker.address,1000);
        await demoErc20.connect(staker).approve(staking.address,1000);
        await staking.connect(staker).deposit(demoErc20.address,1000);
        let stakerBalance = await demoErc20.connect(staker).balanceOf(staker.address);
        let stakingContractBalance = await demoErc20.connect(staker).balanceOf(staking.address);
        assert.equal(1000,stakingContractBalance);
        assert.equal(stakerBalance,0);
    });

    it('check staking status', async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);        
        await demoErc20.connect(deployer).mint(deployer.address,1000);
        await demoErc20.connect(deployer).approve(staking.address,1000);
         await staking.connect(deployer).deposit(demoErc20.address,1000);
        let isstaked = await staking.connect(deployer).stakingId(deployer.address);
        assert.equal(isstaked.isStaked,true);
    });

    it('withdraw token', async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);        
        await demoErc20.connect(deployer).mint(deployer.address,1000);
        await demoErc20.connect(deployer).approve(staking.address,1000);
        await staking.connect(deployer).deposit(demoErc20.address,1000);//2,592,000
        await helpers.time.increase(2629743);
        await staking.connect(deployer).withdraw(deployer.address);
        let withdrawed = await demoErc20.connect(staker).balanceOf(deployer.address);
        console.log(withdrawed);
        assert.equal(withdrawed,1000);
    });

    it('check staking status after withdraw', async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);        
        await demoErc20.connect(deployer).mint(deployer.address,1000);
        await demoErc20.connect(deployer).approve(staking.address,1000);
        await staking.connect(deployer).deposit(demoErc20.address,1000);
        await staking.connect(deployer).withdraw(deployer.address);
        let iswithdrawed = await staking.connect(deployer).stakingId(deployer.address);
        console.log(iswithdrawed);
        assert.equal(iswithdrawed.isStaked,true);


    });

    // it('claim reward', async () => {
    //     await staking.connect(deployer).setAdresses(erc20.address, erc721.address);        
    //     await demoErc20.connect(deployer).mint(deployer.address,1000);
    //     await demoErc20.connect(deployer).approve(staking.address,1000);
    //     await staking.connect(deployer).deposit(demoErc20.address,1000);
    //     await staking.connect(deployer).withdraw(deployer.address);
    //     await staking.connect(deployer).claim(deployer.address);
    //     await erc20.connect(deployer).mint(deployer.address,10);
    //     let claimReward = await erc20.connect(deployer).balanceOf(deployer.address);
    //     console.log(claimReward);
    //     assert.equal(claimReward,10);        

    // });

    // it('check staking status after claim', async () => {
    //     await staking.connect(deployer).setAdresses(erc20.address, erc721.address);        
    //     await demoErc20.connect(deployer).mint(deployer.address,1000);
    //     await demoErc20.connect(deployer).approve(staking.address,1000);
    //     await staking.connect(deployer).deposit(demoErc20.address,1000);
    //     await staking.connect(deployer).withdraw(deployer.address);
    //     await staking.connect(deployer).claim(deployer.address);
    //     await erc721.connect(deployer).mint(deployer.address,10);
    //     let isnftClaimed = await staking.connect(deployer).stakingId(deployer.address);
    //     assert.equal(isnftClaimed.isNftClaimed,true);
    // });

});
