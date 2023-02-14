// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./customIERC20.sol";
import "./customIERC721.sol";

import "hardhat/console.sol";

contract Staking {
    customIERC20 public ERC20Reward;
    customIERC721 public ERC721NFT;
    address public admin;
    uint public stakeCount;
    uint256 interestRate = 10;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the owner");
        _;
    }

    struct StakingId {
        address user;
        address token;
        uint amount;
        uint rewardAmount;
        uint stakedTime;
        uint unStakedTime;
        bool isStaked;
        bool isWithdrawed;
        bool rewardClaimed;
        bool isNftClaimed;
    }

    mapping(address => StakingId) public stakingId;
    mapping(address => uint) public stakeId;

    function setAdresses(address _Erc20, address _nft) public {
        ERC20Reward = customIERC20(_Erc20);
        ERC721NFT = customIERC721(_nft);
    }

    function deposit(address _tokenAdress, uint _amount) public {
        require(
            stakingId[msg.sender].isStaked == false,
            "You're already staked"
        );
        require(_amount > 0, "Amount not greater than zero");
        customIERC20 Erc20 = customIERC20(_tokenAdress);
        uint256 balance = Erc20.balanceOf(msg.sender);
        require(balance >= _amount, "Insufficent balance");
        uint256 allowance = Erc20.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Insufficent allowance");
        Erc20.transferFrom(msg.sender, address(this), _amount);
        stakingId[msg.sender] = StakingId(
            msg.sender,
            _tokenAdress,
            _amount,
            0,
            block.timestamp,
            0,
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
        uint lockTime = stakingId[_stakeid].stakedTime + 2629743; // 1 month check
        require(block.timestamp > lockTime, "1 Month duration not reached");
        stakingId[_stakeid].isWithdrawed = true;
        stakingId[_stakeid].unStakedTime = block.timestamp;
        customIERC20 Erc20 = customIERC20(stakingId[_stakeid].token);
        Erc20.transfer(msg.sender, (stakingId[_stakeid].amount));
    }

    function calculate(
        address _stakeid,
        uint _stakeDuration
    ) private returns (uint256) {
        uint noOfMonth = _stakeDuration / 2629743;
        uint interestForOneMonth = (stakingId[_stakeid].amount * interestRate) /
            100;
        uint totalReward = noOfMonth * interestForOneMonth;
        stakingId[_stakeid].rewardAmount = totalReward;
        return stakingId[_stakeid].rewardAmount;
    }

    function issueToken() public {
        address stakeid = msg.sender;
        require(
            stakingId[stakeid].token != address(0),
            "You're not a depositer"
        );
        require(
            stakingId[stakeid].isWithdrawed == true,
            "You should withdraw first"
        );
        require(
            stakingId[stakeid].rewardClaimed == false,
            "Reward already claimed"
        );
        uint stakeDuration = stakingId[stakeid].unStakedTime -
            stakingId[stakeid].stakedTime;
        uint reward = calculate(stakeid, stakeDuration);
        customIERC20 Erc20 = customIERC20(ERC20Reward);
        stakingId[stakeid].rewardClaimed = true;
        Erc20.mint(stakingId[stakeid].user, reward);

        uint noOfyears = stakeDuration / 31556926;
        if (noOfyears > 0) {
            issueNft(stakeid, noOfyears);
        }
    }

    function issueNft(address _stakeid, uint _noOfyear) private {
        require(
            stakingId[_stakeid].isNftClaimed == false,
            "Nft already claimed"
        );

        customIERC721 nft = customIERC721(ERC721NFT);
        stakingId[_stakeid].isNftClaimed = true;
        for (uint i; i < _noOfyear; i++) {
            nft.safeMint(stakingId[_stakeid].user);
        }
    }
}
