// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TokenETH is ERC20, ERC20Burnable {
    mapping(address => bool) public admins;
    
    constructor() ERC20("TokenETH", "TKNE") {
        admins[msg.sender] = true;
    }

    function mint(address to, uint256 amount) public onlyAdmin {
        _mint(to, amount);
    }

    function burnToken(address owner, uint amount) public onlyAdmin{
        _burn(owner, amount);
    }

    function addAdmin(address _address) public onlyAdmin{
        admins[_address] = true;
    }

    modifier onlyAdmin {
        require(admins[msg.sender], "Only admin");
        _;
    }
}