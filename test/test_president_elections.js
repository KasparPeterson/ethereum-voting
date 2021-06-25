const truffleAssert = require('truffle-assertions');
const timeHelper = require("./time_helper");
const PresidentElections = artifacts.require("PresidentElections");

contract("PresidentElections Deployment", function (/* accounts */) {

    let contract

    before(async function () {
        contract = await PresidentElections.deployed()
    })

    it("is deployed", async function () {
        const name = await contract.name()
        assert.equal(name, "President Elections 2021")
    });

    it("initial votes all zero", async function () {
        const votes1 = await contract.getVotes(PresidentElections.Candidate.DONALD)
        const votes2 = await contract.getVotes(PresidentElections.Candidate.BIDEN)
        assert.equal(votes1, 0)
        assert.equal(votes2, 0)
    })
});

contract("PresidentElections Voting", function (accounts) {
    const DONALD = PresidentElections.Candidate.DONALD
    const BIDEN = PresidentElections.Candidate.BIDEN
    let contract

    before(async function () {
        contract = await PresidentElections.deployed()
    })

    it("voting increases the result", async function () {
        const votes_original = await contract.getVotes(DONALD)
        await contract.vote(DONALD, {from: accounts[0]})
        const votes = await contract.getVotes(DONALD)
        assert.equal(parseInt(votes), parseInt(votes_original) + 1)
    })

    it("voting does not change the other candidate result", async function () {
        const votes_original = await contract.getVotes(BIDEN)
        await contract.vote(DONALD, {from: accounts[0]})
        const votes = await contract.getVotes(BIDEN)
        assert.equal(parseInt(votes), parseInt(votes_original))
    })

    it("voting twice increases the result by 1", async function () {
        const votes_original = await contract.getVotes(DONALD)
        await contract.vote(DONALD, {from: accounts[1]})
        await contract.vote(DONALD, {from: accounts[1]})
        const votes = await contract.getVotes(DONALD)
        assert.equal(parseInt(votes), parseInt(votes_original) + 1)
    })

    it("voting for different candidate changes the vote", async function () {
        const votes_original1 = await contract.getVotes(DONALD)
        const votes_original2 = await contract.getVotes(BIDEN)
        await contract.vote(DONALD, {from: accounts[2]})
        await contract.vote(BIDEN, {from: accounts[2]})
        const votes1 = await contract.getVotes(DONALD)
        const votes2 = await contract.getVotes(BIDEN)
        assert.equal(parseInt(votes1), parseInt(votes_original1))
        assert.equal(parseInt(votes2), parseInt(votes_original2) + 1)
    })

    it("voting fails after voting is over", async function () {
        // TODO: 1. These 2 tests should be ideally separate
        // TODO: 2. This -2 seconds is flaky, should work with -1 instead?
        // Just two seconds before the voting is over it must still succeed
        await timeHelper.advanceTimeAndBlock(3600 * 24 - 2)
        await contract.vote(DONALD, {from: accounts[3]})

        // After advancing time another second it must fail
        await timeHelper.advanceTimeAndBlock(2)
        await truffleAssert.reverts(
            contract.vote(DONALD, {from: accounts[3]}),
            "Voting is over");
    })
});