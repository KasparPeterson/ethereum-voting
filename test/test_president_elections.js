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

contract("PresidentElections Voting", function (/* accounts */) {
    let contract

    before(async function () {
        contract = await PresidentElections.deployed()
    })

    it("voting increases the result", async function () {

    })
}