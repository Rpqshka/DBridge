// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IToken {
  function mint(address to, uint amount) external;
  function burnToken(address owner, uint amount) external;
}