// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RewardToken is ERC20, AccessControl {
    bytes32 public constant STAKE_CONTRACT_ROLE =
        keccak256("STAKE_CONTRACT_ROLE");

    constructor(address _stakeContractAddress) ERC20("RewardToken", "RTK") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(STAKE_CONTRACT_ROLE, _stakeContractAddress);
    }

    function mint(address to, uint256 amount) public isMinter {
        _mint(to, amount);
    }

    modifier isMinter() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(STAKE_CONTRACT_ROLE, msg.sender),
            "Unauthorized"
        );
        _;
    }
}
