const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const {
    mine,
    setBlockGasLimit,
} = require("@nomicfoundation/hardhat-network-helpers");
describe("Staking", () => {
    let deployer;
    let staker;

    let staking;
    let erc20;
    let erc721;
    let demoErc20;

    const deployStaking = async () => {
        const StakingFactory = await ethers.getContractFactory("Staking");
        const Staking = await StakingFactory.deploy();
        staking = await Staking.deployed();
    };

    const deployErc20 = async () => {
        const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
        const RewardToken = await RewardTokenFactory.deploy(staking.address);
        erc20 = await RewardToken.deployed();
    };

    const deployErc721 = async () => {
        const RewardNFTFactory = await ethers.getContractFactory("RewardNFT");
        const RewardNFT = await RewardNFTFactory.deploy(staking.address);
        erc721 = await RewardNFT.deployed();
    };

    const deployDemo = async () => {
        const DemoFactory = await ethers.getContractFactory("Demo");
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

    it("set reward contract address in staking", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        let erc20Address = await staking.connect(staker).ERC20Reward();
        let nftAddress = await staking.connect(staker).ERC721NFT();
        assert.equal(erc20Address, erc20.address);
        assert.equal(nftAddress, erc721.address);
    });

    it("mint demo token and set allowance", async () => {
        await demoErc20.connect(deployer).mint(staker.address, 1000);
        await demoErc20.connect(staker).approve(staking.address, 1000);
        let allowance = await demoErc20
            .connect(staker)
            .allowance(staker.address, staking.address);
        assert.equal(allowance, 1000);
    });

    it("deposit token", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(staker.address, 1000);
        await demoErc20.connect(staker).approve(staking.address, 1000);
        await staking.connect(staker).deposit(demoErc20.address, 1000);
        let stakerBalance = await demoErc20
            .connect(staker)
            .balanceOf(staker.address);
        let stakingContractBalance = await demoErc20
            .connect(staker)
            .balanceOf(staking.address);
        assert.equal(1000, stakingContractBalance);
        assert.equal(stakerBalance, 0);
    });

    it("check staking status", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        let isstaked = await staking.connect(deployer).stakingId(deployer.address);
        assert.equal(isstaked.isStaked, true);
    });

    it("withdraw token", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000); //2,592,000
        await mine(2629745);
        await staking.connect(deployer).withdraw(deployer.address);
        let withdrawed = await demoErc20
            .connect(staker)
            .balanceOf(deployer.address);
        assert.equal(withdrawed, 1000);
    });

    it("check staking status after withdraw", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(2629745);
        await staking.connect(deployer).withdraw(deployer.address);
        let iswithdrawed = await staking
            .connect(deployer)
            .stakingId(deployer.address);
        assert.equal(iswithdrawed.isStaked, true);
    });

    it("issue the bonus token", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(2629800);
        await staking.connect(deployer).withdraw(deployer.address);
        await staking.connect(deployer).issueToken();
        let balance = await erc20.connect(deployer).balanceOf(deployer.address);
        assert.equal(balance, 100);
    });

    it("check staking status after issuing the token", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(2629745);
        await staking.connect(deployer).withdraw(deployer.address);
        await staking.connect(deployer).issueToken();
        let RewardClaimed = await staking
            .connect(deployer)
            .stakingId(deployer.address);
        assert.equal(RewardClaimed.rewardClaimed, true);
    });

    it("issue the nft", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(31556950);
        await staking.connect(deployer).withdraw(deployer.address);
        await staking.connect(deployer).issueToken();
        let balanceNFt = await erc721.connect(deployer).balanceOf(deployer.address);
        assert.equal(balanceNFt, 1);
    });

    it("issue the nft after 2 years", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(63113900);
        await staking.connect(deployer).withdraw(deployer.address);
        await staking.connect(deployer).issueToken();
        let balanceNFt = await erc721.connect(deployer).balanceOf(deployer.address);
        assert.equal(balanceNFt, 2);
    });

    it("check staking status after issuing the token", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(63113900);
        await staking.connect(deployer).withdraw(deployer.address);
        await staking.connect(deployer).issueToken();
        let NFTClaimed = await staking
            .connect(deployer)
            .stakingId(deployer.address);
        assert.equal(NFTClaimed.isNftClaimed, true);
    });

    it("check if the user cant deposit again", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(staker.address, 1000);
        await demoErc20.connect(staker).approve(staking.address, 1000);
        await staking.connect(staker).deposit(demoErc20.address, 1000);
        await expect(
            staking.connect(staker).deposit(demoErc20.address, 1000)
        ).to.be.revertedWith("You're already staked");
    });

    it("check if the amount is greater than 0", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(staker.address, 1000);
        await demoErc20.connect(staker).approve(staking.address, 1000);
        await expect(
            staking.connect(staker).deposit(demoErc20.address, 0)
        ).to.be.revertedWith("Amount not greater than zero");
    });

    it("check if the user has sufficient balance", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(staker.address, 1000);
        await demoErc20.connect(staker).approve(staking.address, 1000);
        await expect(
            staking.connect(staker).deposit(demoErc20.address, 2000)
        ).to.be.revertedWith("Insufficent balance");
    });

    it("check if the user has sufficient allowance", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(staker.address, 1000);
        await demoErc20.connect(staker).approve(staking.address, 500);
        await expect(
            staking.connect(staker).deposit(demoErc20.address, 1000)
        ).to.be.revertedWith("Insufficent allowance");
    });

    it("if the amount is already withdrawed", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(2629745);
        await staking.connect(deployer).withdraw(deployer.address);
        await expect(
            staking.connect(deployer).withdraw(deployer.address)
        ).to.be.revertedWith("Already Withdrawed");
    });

    it("check if 1 month duration reached", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000); //2,592,000
        await mine(262);
        await expect(
            staking.connect(deployer).withdraw(deployer.address)
        ).to.be.revertedWith("1 Month duration not reached");
    });

    it("check if the deposit is already withdrawed", async () => {
        await staking.connect(deployer).setAdresses(erc20.address, erc721.address);
        await demoErc20.connect(deployer).mint(deployer.address, 1000);
        await demoErc20.connect(deployer).approve(staking.address, 1000);
        await staking.connect(deployer).deposit(demoErc20.address, 1000);
        await mine(2629745);
        await expect(staking.connect(deployer).issueToken()).to.be.revertedWith(
            "You should withdraw first"
        );
    });

});
