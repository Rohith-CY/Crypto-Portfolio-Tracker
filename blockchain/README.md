# Crypto Portfolio Tracker — Blockchain

This folder contains the Solidity smart contract and Hardhat configuration for the Blockchain-Based Crypto Portfolio Tracker.

## Technologies Used

- Solidity
- Hardhat
- Ethers.js
- Local Hardhat blockchain

## Project Structure

```text
blockchain/
├── contracts/
│   └── Portfolio.sol
├── scripts/
│   └── deploy.js
├── test/
├── hardhat.config.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- Dependencies installed using `npm install`

## Setup and Execution

Run these commands from the `blockchain` directory.

### 1. Install dependencies

```bash
npm install
```

### 2. Compile the smart contract

```bash
npx hardhat compile
```

### 3. Run tests

```bash
npx hardhat test
```

### 4. Start the local blockchain

Open a terminal and run:

```bash
npx hardhat node
```

Keep this terminal running.

### 5. Deploy the contract

Open a second terminal in the `blockchain` directory and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The deployment script deploys the `Portfolio` contract and updates the frontend ABI and contract address.

## Smart Contract Features

- Add cryptocurrency holdings.
- Retrieve holdings belonging to the connected wallet.
- Remove holdings.
- Validate holding details.
- Emit events when holdings are added or removed.

## Frontend Integration

The React frontend uses the deployed contract's ABI and address to interact with the local blockchain through MetaMask.

Configure MetaMask to use the local Hardhat network:

- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`

**Note:** The local Hardhat blockchain is intended for development and testing. Restarting it creates a fresh local chain, so previously deployed contracts and their on-chain data may no longer be available.