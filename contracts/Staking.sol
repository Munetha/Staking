// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract Staking {
    address public Erc20;
    address public nft;
    uint public stakeCount;
    uint256 interestRate = 10 * 10 ** 2;

    struct StakingId {
        address user;
        address token;
        uint amount;
        uint rewardAmount;
        uint stakedTime;
        bool isStaked;
        bool isWithdrawed;
        bool rewardClaimed;
        bool isNftClaimed;
    }

    mapping(address => StakingId) public stakingId;
    mapping(address => uint) public stakeId;

    function setAdresses(address _Erc20, address _nft) public {
        Erc20 = _Erc20;
        nft = _nft;
    }

    function deposit(address _tokenAdress, uint _amount) public {
        require(
            stakingId[msg.sender].isStaked == false,
            "You're already staked"
        );
        require(_amount > 0, "Amount not greater than zero");
        IERC20 erc20 = IERC20(_tokenAdress);
        uint256 balance = erc20.balanceOf(msg.sender);
        require(balance >= _amount, "Insufficent balance");
        uint256 allowance = erc20.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Insufficent allowance");
        erc20.transferFrom(msg.sender, address(this), _amount);
        stakingId[msg.sender] = StakingId(
            msg.sender,
            _tokenAdress,
            _amount,
            0,
            block.timestamp,
            true,
            false,
            false,
            false
        );
        stakeCount = stakeCount + 1;
        stakeId[msg.sender] = stakeCount;
    }

    function getStakingDetails(
        address _stakeid
    ) public view returns (StakingId memory) {
        return stakingId[_stakeid];
    }

    function withdraw(address _stakeid) public {
        require(
            stakingId[_stakeid].isWithdrawed == false,
            "Already Withdrawed"
        );
        require(
            stakingId[_stakeid].token != address(0),
            "You're not a depositer"
        );
     uint lockTime = stakingId[_stakeid].stakedTime + 60; // 1 min time + 2592000
        require(block.timestamp > lockTime, "1 Month duration not reached");
        uint stakeDuration = block.timestamp - stakingId[_stakeid].stakedTime;
        uint noOfMonth = stakeDuration / 2592000;
        uint interestForOneMonth = (stakingId[_stakeid].amount) *
            (interestRate / 100);
        uint totalReward = noOfMonth * interestForOneMonth;
       stakingId[_stakeid].rewardAmount = totalReward;
        stakingId[_stakeid].isWithdrawed = true;
        IERC20 erc20 = IERC20(stakingId[_stakeid].token);
        erc20.transfer(msg.sender, (stakingId[_stakeid].amount));
    }

    function claim(address _stakeid) public {
        require(
            stakingId[_stakeid].token != address(0),
            "You're not a depositer"
        );
        require(
            stakingId[_stakeid].isWithdrawed == true,
            "You should withdraw first"
        );
        require(
            stakingId[_stakeid].rewardClaimed == false,
            "Reward already claimed"
        );
        // uint lockTime = stakingId[_stakeid].stakedTime + 60; // 1 min time + 2,592,000
        // require(block.timestamp > lockTime, "1 Month duration not reached");
        
        IERC20 rewardErc20 = IERC20(Erc20);
        rewardErc20.transferFrom(Erc20,msg.sender, stakingId[_stakeid].rewardAmount);

        // uint stakeDuration = block.timestamp - stakingId[_stakeid].stakedTime;
        // require(stakeDuration > 31536000,"1 year not reached");

        // IERC721 rewardNft = IERC721(nft);
        // rewardNft.transferFrom(nft,msg.sender, 1);
         

    }
}
