# Voter Smart Contract

Solidity-based smart contract that facilitates a simple voting system. The contract allows users to vote for two candidates while ensuring each voter can only vote once. The contract also includes functionalities for managing and resetting votes.

## Features

- **Owner Restriction:** Only the owner can reset votes.
- **Single Vote Per Voter:** Each address is allowed to vote only once.
- **Vote Tracking:** Keeps track of votes for two candidates and the total votes.
- **Error Handling:** Prevents invalid operations, such as voting for an invalid candidate or voting multiple times.
- **Static Web UI:** Includes a simple GitHub Pages-ready UI in `docs/`.

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

### Web UI

This repository includes a simple static frontend in `docs/` for the deployed Sepolia contract:

```text
0x6968e292689EE7205a42E69398EfdFB17Aee3DBf
```

The UI lets users connect MetaMask, view vote totals, vote for candidate 1 or 2, check whether the connected wallet has already voted, and reset votes if the connected wallet is the contract owner.

To preview the UI locally:

```bash
cd docs
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

To publish with GitHub Pages, set the Pages source to the `docs/` folder from your repository settings.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
