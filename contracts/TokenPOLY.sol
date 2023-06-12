// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenETH is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("TokenPoly", "TKNP") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address owner, uint amount) external onlyOwner{
        _burn(owner, amount);
    }
}