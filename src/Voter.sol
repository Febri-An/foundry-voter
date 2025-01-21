// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voter {
    address private immutable owner;
    uint256 public totalVotes = 0;
    uint256 public candidateOneVotes = 0;
    uint256 public candidateTwoVotes = 0;

    mapping(address => bool) public voters;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function vote(uint256 candidate) public {
        require(!voters[msg.sender], "You have already voted");

        voters[msg.sender] = true;
        if (candidate == 1) {
            candidateOneVotes++;
        } else if (candidate == 2) {
            candidateTwoVotes++;
        }
        totalVotes++;
    }

    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }

    function getVotes(uint256 candidate) public view returns (uint256) {
        if (candidate == 1) {
            return candidateOneVotes;
        } else if (candidate == 2) {
            return candidateTwoVotes;
        } else {
            revert("Invalid candidate");
        }
    }

    function resetVotes() public onlyOwner {
        totalVotes = 0;
        candidateOneVotes = 0;
        candidateTwoVotes = 0;
    }
}
