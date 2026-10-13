# Crypto Portfolio Tracker — Frontend

This folder contains the React frontend for the Blockchain-Based Crypto Portfolio Tracker. It provides an interface for connecting a wallet, managing cryptocurrency holdings, viewing portfolio statistics, and checking transaction history.

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- Ethers.js
- MetaMask

## Features

- Connect to MetaMask.
- Add and remove cryptocurrency holdings.
- View holdings associated with the connected wallet.
- Display portfolio value and invested amount.
- Calculate profit and loss.
- View portfolio allocation.
- View transaction history and transaction statuses.

## Prerequisites

- Node.js and npm
- MetaMask browser extension
- The local Hardhat blockchain and deployed Portfolio contract

## Installation

Open a terminal in the `frontend` directory and run:

```bash
npm install
```

## Run the Application

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, usually:

```text
http://localhost:5173
```

## Connect MetaMask

Configure MetaMask to connect to the local Hardhat network:

- Network name: Hardhat Local
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: ETH

Make sure the Hardhat node is running and the Portfolio contract has been deployed before using blockchain features.

## Blockchain Integration

The frontend interacts with the Solidity Portfolio contract deployed on the local Hardhat network. The contract ABI and deployed address are maintained in the frontend source configuration.

## Important Notes

- This project is configured for local development and testing.
- Transaction confirmation requires approval in MetaMask.
- Restarting the local Hardhat blockchain resets its local state.
- Cryptocurrency prices entered in the application are not necessarily live market prices.

## Related Folder

The `blockchain/` directory contains the Solidity contract, Hardhat configuration, deployment script, and contract tests.