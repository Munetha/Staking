// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RewardNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant STAKE_CONTRACT_ROLE =
        keccak256("STAKE_CONTRACT_ROLE ");

    Counters.Counter private _tokenIdTracker;

    modifier isMinter() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(STAKE_CONTRACT_ROLE, msg.sender),
            "Unauthorized"
        );
        _;
    }

    constructor(address _stakeContractAddress) ERC721("RewardNFT", "RNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(STAKE_CONTRACT_ROLE, _stakeContractAddress);
    }

    function mint(address to) public isMinter {
        _mint(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC721) returns (bool) {
        return
            AccessControl.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId);
    }
}
