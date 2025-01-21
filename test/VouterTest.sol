// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Voter} from "../src/Voter.sol";
import {DeployVoter} from "../script/DeployVoter.s.sol";

contract VoterTest is Test {
    Voter voter;

    address USER = makeAddr("user");

    function setUp() public {
        DeployVoter deployVoter = new DeployVoter();
        voter = deployVoter.run();
    }

    function testIsOwner() public view {
        assert(voter.getOwner() == msg.sender);
    }

    function testVote() public {
        voter.vote(1);
        assert(voter.getVotes(1) == 1);

        uint256 totalVotes = voter.getTotalVotes();
        assert(totalVotes == 1);
    }

    function testVoteTwice() public {
        voter.vote(1);

        vm.expectRevert();
        voter.vote(2);

        uint256 totalVotes = voter.getTotalVotes();
        assert(totalVotes == 1);
    }

    function testResetVotes() public {
        vm.startPrank(voter.getOwner());
        voter.resetVotes();
        vm.stopPrank();
        assert(voter.getTotalVotes() == 0);
        assert(voter.getVotes(1) == 0);
        assert(voter.getVotes(2) == 0);
    }
}
