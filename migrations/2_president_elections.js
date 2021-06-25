const PresidentElections = artifacts.require("PresidentElections");

module.exports = function (deployer) {
  deployer.deploy(PresidentElections);
};
