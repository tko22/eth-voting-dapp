pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Voting.sol";

contract TestAdoption {
  Voting v = Voting(DeployedAddresses.Voting());

  function testVote() public {
    
  }
}