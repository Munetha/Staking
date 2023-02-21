// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./interfaces/IERC20Mint.sol";
import "./interfaces/IERC721Mint.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title Staking
/// @notice Use this contract for staking erc20 tokens and give bonus based on time it is staked
contract Staking {
    // the struct is used to store the various details needed for the contract
    struct Stake {
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

    IERC20Mint public ERC20Reward;
    IERC721Mint public ERC721NFT;

    address public admin;
    uint public stakeCount = 1;
    uint256 public interestRate;

    mapping(uint => Stake) public stakes;
    mapping(address => uint256[]) public stakeDetails;

    event deposited(uint256 stakeId, address indexed from, uint256 value);
    event withdrawed(uint256 stakeId, address indexed from, uint256 value);
    event tokensIssued(uint256 stakeId, address indexed from, uint256 value);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the owner");
        _;
    }

    constructor(uint256 _interestRate) {
        admin = msg.sender;
        interestRate = _interestRate;
    }

    /// @notice setAdresses function is to se the address of the reward erc20 and nft
    /// @param _Erc20 and _nft are the address passed

    function setAdresses(address _Erc20, address _nft) public onlyAdmin {
        ERC20Reward = IERC20Mint(_Erc20);
        ERC721NFT = IERC721Mint(_nft);
    }

    /// @notice to deposit the amount into the staking contract
    /// @param _tokenAdress provides the address of the token
    /// @param _amount provides the amount to be deposited

    function deposit(address _tokenAdress, uint _amount) public {
        require(_is20(_tokenAdress), "not token address");

        IERC20 Erc20 = IERC20(_tokenAdress);
        // uint checkTotalSupply = Erc20.totalSupply();
        // require(checkTotalSupply > 0, "Invalid token");
        require(_amount > 0, "Amount not greater than zero");
        uint256 balance = Erc20.balanceOf(msg.sender);
        require(balance >= _amount, "Insufficent balance");
        uint256 allowance = Erc20.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Insufficent allowance");
        Erc20.transferFrom(msg.sender, address(this), _amount);

        stakes[stakeCount] = Stake(
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

        stakeDetails[msg.sender].push(stakeCount);

        emit deposited(stakeCount, msg.sender, _amount);
        stakeCount = stakeCount + 1;
    }

    // By using the getstaking details we get the details of the struct elements
    /// @notice getStakingDetails get the struct values
    /// @param _stakeid provide the id in which it is staked
    /// @return the struct elements
    function getStakingDetails(
        uint _stakeid
    ) public view returns (Stake memory) {
        return stakes[_stakeid];
    }

    /// @notice withdraw the deposited amount
    /// @dev By using withdraw function if chechk several conditions and the main thing is the locked up time
    ///after the conditions are satisfied we send the amount to the user
    ///we create an instance of cusom ierc20 token and from there we transfer the amount
    /// @param _stakeid provide the id in which it is staked
    function withdraw(uint _stakeid) public {
        require(stakes[_stakeid].isWithdrawed == false, "Already Withdrawed");
        require(stakes[_stakeid].token != address(0), "You're not a depositer");
        uint lockTime = stakes[_stakeid].stakedTime + 2629743; // 1 month check ,2629743
        require(block.timestamp > lockTime, "1 Month duration not reached");
        stakes[_stakeid].isWithdrawed = true;
        stakes[_stakeid].unStakedTime = block.timestamp;
        IERC20 Erc20 = IERC20(stakes[_stakeid].token);
        Erc20.transfer(msg.sender, (stakes[_stakeid].amount));
        emit withdrawed(stakeCount, msg.sender, (stakes[_stakeid].amount));
    }

    /// @notice Calculate the bonus token
    /// @dev By providing the interest rate and time period we calculate the amount
    /// @param _stakeid id which it is deposited
    /// @param _stakeDuration time period in which the amount is staked
    /// @return uint reward erc20 tokens

    function calculate(
        uint _stakeid,
        uint _stakeDuration
    ) internal returns (uint256) {
        uint noOfMonth = _stakeDuration / 2629743; //2629743
        uint interestForOneMonth = (stakes[_stakeid].amount * interestRate) /
            100;
        uint totalReward = noOfMonth * interestForOneMonth;
        stakes[_stakeid].rewardAmount = totalReward;
        return stakes[_stakeid].rewardAmount;
    }

    /// @notice issueToken for tranfering the reward token to the user
    /// @dev we can issue the token by checking various conditions so the
    /// requird conditions are satisfied we send the amount to the user account
    /// @param _stakeid provide the id in which it is staked
    function issueToken(uint _stakeid) public {
        require(stakes[_stakeid].token != address(0), "You're not a depositer");
        require(
            stakes[_stakeid].isWithdrawed == true,
            "You should withdraw first"
        );
        require(
            stakes[_stakeid].rewardClaimed == false,
            "Reward already claimed"
        );
        uint stakeDuration = stakes[_stakeid].unStakedTime -
            stakes[_stakeid].stakedTime;
        uint reward = calculate(_stakeid, stakeDuration);
        IERC20Mint Erc20 = IERC20Mint(ERC20Reward);
        stakes[_stakeid].rewardClaimed = true;
        Erc20.mint(stakes[_stakeid].user, reward);

        uint noOfyears = stakeDuration / 31556926; //31556926
        if (noOfyears > 0) {
            issueNft(_stakeid, noOfyears);
        }
        uint256[] memory array = updateStakerDetails(_stakeid);
        stakeDetails[msg.sender] = array;
    }

     /// @notice issueNft provide the tranfering of the nft to the user
     /// @dev it checks how much time the token is been invested and provide the
     /// @param _stakeid provide the staked number
     /// @param _noOfyear the time it is staked
     

    function issueNft(uint _stakeid, uint _noOfyear) internal {
        require(stakes[_stakeid].isNftClaimed == false, "Nft already claimed");

        IERC721Mint nft = IERC721Mint(ERC721NFT);
        stakes[_stakeid].isNftClaimed = true;
        for (uint i; i < _noOfyear; i++) {
            nft.mint(stakes[_stakeid].user);
        }
        emit tokensIssued(stakeCount, msg.sender, (stakes[_stakeid].amount));
    }

    /// @notice updateStakerDetails contain an array of stake id and it will remove the staked id
    /// @dev it removes the id which is staked and removed the id
    /// @param _stakeid provide the staked number
    /// @return uint[] return the updared details of the stake id

    function updateStakerDetails(
        uint _stakeid
    ) internal returns (uint256[] memory) {
        uint256[] storage details = stakeDetails[msg.sender];
        uint i = 0;
        while (details[i] != _stakeid) {
            i++;
        }
        details[i] = details[details.length - 1];
        details.pop();

        return details;
    }

    /// @notice _is20 will check if the provided token adress is valid or nor
    /// @param tokenContract provide the adress of the token
    /// @return bool the if it is erc20 or not

    function _is20(address tokenContract) internal returns (bool) {
        return _checkInterface(tokenContract, type(IERC20).interfaceId);
    }

    function _checkInterface(
        address tokenContract,
        bytes4 interfaceId
    ) internal returns (bool) {
        bytes memory payload = abi.encodeWithSignature(
            "supportsInterface(bytes4)",
            interfaceId
        );
        (bool success, bytes memory returnData) = tokenContract.call(payload);
        if (!success) return false;

        bool result = abi.decode(returnData, (bool));
        return result;
    }
}
