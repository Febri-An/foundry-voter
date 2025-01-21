// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {Voter} from "../src/Voter.sol";

contract DeployVoter is Script {
    Voter public voter;

    function run() external returns (Voter) {
        vm.startBroadcast();
        voter = new Voter();
        vm.stopBroadcast();
        return voter;
    }
}
