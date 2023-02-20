// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../interfaces/customIERC20.sol";
import "../interfaces/customIERC721.sol";


//** @title Staking */
contract Staking {
    customIERC20 public ERC20Reward;
    customIERC721 public ERC721NFT;
    address public admin;
    uint public stakeCount = 1;
    uint256 public interestRate;
    uint256[] addressDetails;

    constructor(uint256 _interestRate) {
        admin = msg.sender;
        interestRate = _interestRate;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the owner");
        _;
    }
    event deposited(address indexed from, uint256 value);
    event withdrawed(address indexed from, uint256 value);
      
    // the struct is used to store the various details needed for the contract
    struct StakingId {
        address user;
        address token;
        uint stakerId;
        uint amount;
        uint rewardAmount;
        uint stakedTime;
        uint unStakedTime;
        bool isStaked;
        bool isWithdrawed;
        bool rewardClaimed;
        bool isNftClaimed;
    }

    mapping(uint => StakingId) public stakingId;
    mapping(address => uint256[]) public stakerDetails;


    /** 
    *In the set address function we pass the addresses of the rewardtoken contract and the rewardnft token 
    *and the admin can only set these address,here we
    *  are using a custom interface for setting the address
    */

    function setAdresses(address _Erc20, address _nft) public onlyAdmin {
        ERC20Reward = customIERC20(_Erc20);
        ERC721NFT = customIERC721(_nft);
    }


    /**
    *In the deposit function we are passing the token adress of the user and the amount ,
    *we check several conditions by using struct elements
    * after that by using custom interfce object erc20 we tranfer the amount from user to this contract
    * after that we update the struct elements
    */

    function deposit(address _tokenAdress, uint _amount) public {
   
        customIERC20 Erc20 = customIERC20(_tokenAdress);
        uint checkTotalSupply = Erc20.totalSupply();
        require(checkTotalSupply > 0,"Invalid token");
        require(_amount > 0, "Amount not greater than zero");
        uint256 balance = Erc20.balanceOf(msg.sender);
        require(balance >= _amount, "Insufficent balance");
        uint256 allowance = Erc20.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Insufficent allowance");
        Erc20.transferFrom(msg.sender, address(this), _amount);

        stakingId[stakeCount] = StakingId(
            msg.sender,
            _tokenAdress,
            stakeCount,
            _amount,
            0,
            block.timestamp,
            0,
            true,
            false,
            false,
            false
        );

        stakerDetails[msg.sender].push(stakeCount);
        stakeCount = stakeCount + 1;

        emit deposited(msg.sender, _amount);
        
    }

    

    // By using the getstaking details we get the details of the struct elements
    function getStakingDetails(
        uint _stakeid
    ) public view returns (StakingId memory) {
        return stakingId[_stakeid];
    }

    /** 
    *By using withdraw function if chechk several conditions and the main thing is the locked up time
    *after the conditions are satisfied we send the amount to the user
    *we create an instance of cusom ierc20 token and from there we transfer the amount
    */
    function withdraw(uint _stakeid) public {
        require(
            stakingId[_stakeid].isWithdrawed == false,
            "Already Withdrawed"
        );
        require(
            stakingId[_stakeid].token != address(0),
            "You're not a depositer"
        );
        uint lockTime = stakingId[_stakeid].stakedTime + 60; // 1 month check ,2629743
        require(block.timestamp > lockTime, "1 Month duration not reached");
        stakingId[_stakeid].isWithdrawed = true;
        stakingId[_stakeid].unStakedTime = block.timestamp;
        customIERC20 Erc20 = customIERC20(stakingId[_stakeid].token);
        Erc20.transfer(msg.sender, (stakingId[_stakeid].amount));
        emit withdrawed(msg.sender, (stakingId[_stakeid].amount));
    }

    /** 
    *int the calculate function we calculate the interest that should be given to the user
    */

    function calculate  (
        uint _stakeid,
        uint _stakeDuration
    ) internal returns (uint256) {
        uint noOfMonth = _stakeDuration / 60;//2629743
        uint interestForOneMonth = (stakingId[_stakeid].amount * interestRate) /
            100;
        uint totalReward = noOfMonth * interestForOneMonth;
        stakingId[_stakeid].rewardAmount = totalReward;
        return stakingId[_stakeid].rewardAmount;
    }

    /**
    *we can issue the token by checking various conditions so the 
    requird conditions are satisfied we send the amount to the user account
    *for that we mint that token from our reward token
    */
    function issueToken(uint _stakeid) public {
        // address stakeid = msg.sender;
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
        uint stakeDuration = stakingId[_stakeid].unStakedTime -
            stakingId[_stakeid].stakedTime;
        uint reward = calculate(_stakeid, stakeDuration);
        customIERC20 Erc20 = customIERC20(ERC20Reward);
        stakingId[_stakeid].rewardClaimed = true;
        Erc20.mint(stakingId[_stakeid].user, reward);

        uint noOfyears = stakeDuration / 120;//31556926
        if (noOfyears > 0) {
            issueNft(_stakeid, noOfyears);
        }
       uint256[] memory array = updateStakerDetails(_stakeid); 
        stakerDetails[msg.sender] = array ;
    }

    function issueNft(uint _stakeid, uint _noOfyear) internal {
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

     function updateStakerDetails(uint _stakeid) internal returns (uint256[] memory) {
     uint256[] storage details =  stakerDetails[msg.sender];
       uint i =0;
       while (details[i] != _stakeid ) {
           i++;
       }
        details[i] = details[details.length-1];
        details.pop();

        return details;


     }
    }
