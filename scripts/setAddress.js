const hre = require("hardhat");


async function main() {
  // Set up the provider and signer
  const [admin] = await hre.ethers.getSigners();

  // Deploy the contract
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy();
  // Call the setAdresses function
  const erc20Address = "0x8E65d8F4875272955891469093f5730E6b6E8cbf"; // Replace with the address of your ERC20 token
  const nftAddress = "0xfb46d32822bbEA26e2B62e377c38BE777B06c316"; // Replace with the address of your NFT
  const tx = await staking.connect(admin).setAdresses(erc20Address, nftAddress);
  console.log("Transaction hash:", tx.hash);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
