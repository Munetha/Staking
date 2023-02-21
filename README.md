QUICK START
npm install

write .env file for the required inputs

npx hardhat run scripts/deploy.js --network NETWORK To Deploy Code 
npx hardhat test To Test Code

Introduction

This staking contract accepts ERC20 tokens for staking and the rewards are claimable after 1 month cap

The contract calculate the rewards monthly until it is staked

An NFT is provided after 1 year time cap

Users needs to approve tokens at the staking contract address
