const hre = require("hardhat");

async function main() {
  // Deploy the token and staking contracts
  const Token = await hre.ethers.getContractFactory("Demo");
  const token = await Token.deploy();
  await token.deployed()
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy("10");
  await staking.deployed();
  const Reward = await hre.ethers.getContractFactory("RewardToken")
  const reward = await Reward.deploy(staking.address);
  const NFT = await hre.ethers.getContractFactory("RewardNFT")
  const nft = await Reward.deploy(staking.address);

  console.log("Token deployed to:", token.address);
  console.log("Staking deployed to:", staking.address);

  // Approve the staking contract to spend the token
  const [owner] = await hre.ethers.getSigners();
  const amount = "100";
  await token.mint(owner.address, amount);

  console.log(`Minted ${amount} tokens to ${owner.address}`);
  await token.connect(owner).approve(staking.address, amount);

  const tx = await staking.connect(owner).setAdresses(reward.address, nft.address);

 const rewardAddress= await staking.ERC20Reward();
 const nftAddress = await staking.ERC721NFT();

 console.log("reward token is :", rewardAddress);
 console.log("Reward NFT is :", nftAddress);

  // Deposit some tokens into the staking contract
  await staking.connect(owner).deposit(token.address, 50);

  // Get the staking ID of the deposit
  const stakingId = 1;

  const stakeDetails = await staking.getStakingDetails(stakingId)
  console.log(stakeDetails);
  // Wait for one minute (in seconds) to pass
  const waitTime = 120;
  console.log(`Waiting for ${waitTime} seconds...`);
  await new Promise(resolve => setTimeout(resolve, waitTime * 1000));

  // Withdraw the deposited tokens
  await staking.connect(owner).withdraw(stakingId);
  console.log("Withdrawal complete.");

 const stake = await staking.getStakingDetails(stakingId)
  console.log(stake);

 await staking.connect(owner).issueToken(stakingId);
  await reward.connect(staking.address).mint(owner,stakingId(stakingId).rewardAmount)

  const rewardClaimed = await staking.stakingId(stakingId).rewardClaimed;
  if (rewardClaimed) {
    console.log("Reward claimed successfully.");
  } else {
    console.log("Reward could not be claimed.");
  }

  const balance = await reward.balanceOf(owner);
  console.log(`User ${owner} has a balance of ${balance} tokens.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
