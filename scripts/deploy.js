const { ethers } = require("hardhat");

async function main() {
  const StakingFactory = await ethers.getContractFactory("Staking");
  const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
  const RewardNFTFactory = await ethers.getContractFactory("RewardNFT");
  const DemoFactory = await ethers.getContractFactory("Demo");
<<<<<<< HEAD
  const staking = await StakingFactory.deploy("10");
=======
  const staking = await StakingFactory.deploy(15);
>>>>>>> 84f3f771a672136b1aec106d0e3515fb2e9d78f9
  await staking.deployed();
  const RewardToken = await RewardTokenFactory.deploy(staking.address);
  await RewardToken.deployed();
  const RewardNFT = await RewardNFTFactory.deploy(staking.address);
  await RewardNFT.deployed();
  const Demo = await DemoFactory.deploy();
  await Demo.deployed();
  console.log(`Staking contract address is : ${staking.address},`);
  console.log(`RewardToken address is : ${RewardToken.address},`);
  console.log(`RewardNFT address is : ${RewardNFT.address},`);
  console.log(`Demo contract address is : ${Demo.address},`);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});