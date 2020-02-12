const Migrations = artifacts.require("Migrations");
const ClaimContract = artifacts.require("ClaimContract");


module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ClaimContract);
};