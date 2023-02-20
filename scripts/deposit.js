const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();

  // Deploy the token contract
  const Token = await hre.ethers.getContractFactory("Demo");
  const token = await Token.deploy();

  // Mint 100 tokens to the user
  await token.mint(user.address, 100);

  // Check the user balance
  const balanceBefore = await token.balanceOf(user.address);
  console.log(`User balance before deposit: ${balanceBefore.toString()}`);

  // Approve the staking contract to spend the user's tokens
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy();
  await token.approve(staking.address, 100);

  // Deposit the tokens to the staking contract
  const tx = await staking.deposit(token.address, 50);
  console.log("Tokens deposited to staking contract!");
  console.log("Transaction hash:", tx.hash);

  // Check the user balance again
  const balanceAfter = await token.balanceOf(user.address);
  console.log(`User balance after deposit: ${balanceAfter.toString()}`);

  const stakingDetails = await staking.getStakingDetails(user.address);

  console.log(stakingDetails);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
