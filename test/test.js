import { ethers } from 'hardhat';
const deployStaking = async() => {
    const StakingFactory = await ethers.getContractFactory('Staking');
    const Staking = (await StakingFactory.deploy());
    await Staking.deployed();

};

