# Voter Smart Contract

Solidity-based smart contract that facilitates a simple voting system. The contract allows users to vote for two candidates while ensuring each voter can only vote once. The contract also includes functionalities for managing and resetting votes.

## Features

- **Owner Restriction:** Only the owsimple-storagener can reset votes.
- **Single Vote Per Voter:** Each address is allowed to vote only once.
- **Vote Tracking:** Keeps track of votes for two candidates and the total votes.
- **Error Handling:** Prevents invalid operations, such as voting for an invalid candidate or voting multiple times.

## Requirements

- **Solidity Version:** ^0.8.18
- **Development Environment:** [Foundry](https://book.getfoundry.sh/), [Remix](https://remix.ethereum.org/), or any EVM-compatible frame work.

## Setup

Clone the repository:
```bash
git clone https://github.com/Febri-An/foundry-voter.git
cd foundry-voter
```
Install dependencies:
```bash
forge install
```

## Usage
### Running the Tests
To run the unit tests:
```bash
forge test
```
### Formatting Code
Ensure your code is formatted:
```bash
forge fmt
```
### Deploying the Contract
To deploy the contract locally:
```bash
forge script script/DeployVoter.s.sol --fork-url http://127.0.0.1:8545 --broadcast
```
## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
