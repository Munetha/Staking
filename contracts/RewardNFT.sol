// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RewardNFT is ERC721, AccessControl {
    bytes32 public constant STAKE_CONTRACT_ROLE =
        keccak256("STAKE_CONTRACT_ROLE ");

    constructor(address _stakeContractAddress) ERC721("RewardNFT", "RNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(STAKE_CONTRACT_ROLE, _stakeContractAddress);
    }

    function safeMint(address to, uint256 tokenId) public isMinter {
        _safeMint(to, tokenId);
    }

    modifier isMinter() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(STAKE_CONTRACT_ROLE, msg.sender),
            "Unauthorized"
        );
        _;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC721) returns (bool) {
        return
            AccessControl.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId);
    }
}
