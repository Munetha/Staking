// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Demo is ERC20 {
    constructor() ERC20("UserToken", "UTK") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual returns (bool) {
        return
            interfaceId == type(IERC20).interfaceId;
    }
}
