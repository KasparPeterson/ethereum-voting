// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PresidentElections {

    string public name = "President Elections 2021";

    enum Candidate {
        DONALD,
        BIDEN
    }

    mapping(address => Candidate) votes;
    mapping(uint => uint) voteResults;

    constructor() public {
    }

    function vote(Candidate candidate) public {
        // * each address can vote one time
        // * is able to change the vote
        // * voting has an ending
        // * some governing mechanism so that one
        //   person cannot make infinite new addresses
    }

    function getVotes(Candidate candidate) public view returns (uint) {
        return voteResults[uint(candidate)];
    }
}
