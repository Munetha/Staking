# Staking contract
 This is a staking contract it accepts all kind of ERC20 tokens.
 The tokens are locked in the contract 1 month and after 1 month the user can withdraw at any time and bonus ERC20 token is given.The bonus is given based on how much time the token is staked.If the tokens are staked in the contract for 1 year then we get a bonus NFT. 

## Installation

### **Running Instructions**

- Copy project to your directory  

  ``git clone https://github.com/Munetha/Staking/tree/master``

- Install project dependencies

   ``npm install``

- Start project  

  ``npm run start``

### **For Testing** 
npx hardhat test 

### **For deployment**
-----------------------------------------------------------------------------------------------------------------------------------------------------------

#### For Localhost

- Run node locally

       ``npx hardhat node``

- Open a new terminal and paste the below command

        ``npx hardhat run --network localhost scripts/deploy.js``

#### For georli 


        ``npx hardhat run --network georli scripts/deploy.js``

#### For Polygon mumbai

        ``npx hardhat run --network polygon_mumbai scripts/deploy.js``
