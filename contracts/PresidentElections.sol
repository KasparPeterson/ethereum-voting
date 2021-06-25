// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PresidentElections {

    string public name = "President Elections 2021";

    enum Candidate {
        DONALD,
        BIDEN
    }

    uint votingEnd;
    mapping(address => bool) private hasVoted;
    mapping(address => Candidate) private votes;
    mapping(uint => uint) private voteResults;

    constructor() public {
        // This voting lasts for just one day
        votingEnd = now + 1 days;
    }

    function vote(Candidate candidate) public {
        // 1. each address can vote one time
        // 2. is able to change the vote
        // 3. voting has an ending
        // 4. some governing mechanism so that one
        //   person cannot make infinite new addresses
        // 5. handle overflow?
        require(now < votingEnd, "Voting is over");
        if (!hasVoted[msg.sender]) {
            hasVoted[msg.sender] = true;
            votes[msg.sender] = candidate;
            voteResults[uint(candidate)] = voteResults[uint(candidate)] + 1;
        } else {
            Candidate previous = votes[msg.sender];
            votes[msg.sender] = candidate;
            voteResults[uint(previous)] = voteResults[uint(previous)] - 1;
            voteResults[uint(candidate)] = voteResults[uint(candidate)] + 1;
        }
    }

    function getVotes(Candidate candidate) public view returns (uint) {
        return voteResults[uint(candidate)];
    }
}
