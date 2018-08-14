var Rullete = artifacts.require("./Rullete.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(
    Rullete, 
    { from: accounts[2], gas: 6721975, value: 50000000000000 }
  );
};
