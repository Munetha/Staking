// import { ethers } from 'hardhat';

// const deployNiftySouq = async (deployer: any, serviceFee: number, bidIncreasePercentage: number) => {
//     const NiftySouqFactory = await ethers.getContractFactory('NiftySouq');
//     const niftySouq = (await NiftySouqFactory.deploy());
//     await niftySouq.deployed();
//     await niftySouq.connect(deployer).initialize(serviceFee, bidIncreasePercentage);

//     return niftySouq;
// };
// describe('NiftySouq - Fixed Price Sale with Cypto Currency', () => {
//     let niftySouq: any;
//     let signers: any;

//     let owner: any;
//     let minter: any;
//     before(async () => {
//         signers = await ethers.getSigners();

//         owner = signers[0];
//         minter = signers[1];

//         niftySouq = await deployNiftySouq(owner, 0, 0);
//     });

//     it('mint token to owner', async () => {
//         await niftySouq.connect(minter)['mint(uint256,(uint256[],address[]))'](1, {
//             royalties: [50, 50],
//             creators: ['dsfgdfg', 'sdfgdfsgdfgf']
//         });
//     });
// });


import { ethers } from 'hardhat';
const deployStaking = async() => {
    const StakingFactory = await ethers.getContractFactory('Staking');
    const Staking = (await StakingFactory.deploy());
    await Staking.deployed();

};

