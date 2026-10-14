# Crypto Portfolio Tracker

A blockchain-based cryptocurrency portfolio management application that allows users to connect their wallets, manage cryptocurrency holdings, and track investment performance through a web interface.

## Features

- **Wallet Integration:** Connect your MetaMask wallet.
- **Portfolio Management:** Add, view, and remove cryptocurrency holdings.
- **Smart Contract:** Store and manage user-specific holdings using Solidity.
- **Dashboard:** View invested amount, current portfolio value, and profit or loss.
- **Transaction History:** View application transaction activity.
- **Input Validation:** Validate holding details before storing them.
- **Automated Testing:** Includes six smart contract tests using Hardhat and Chai.

## Tech Stack

- **Frontend:** React.js, JavaScript, Vite, CSS
- **Blockchain:** Solidity, Ethereum-compatible local blockchain
- **Development Environment:** Hardhat
- **Wallet:** MetaMask
- **Smart Contract Interaction:** Ethers.js
- **Testing:** Hardhat, Chai
- **Version Control:** Git and GitHub

## Project Structure

```text
Crypto-Portfolio-Tracker/
├── blockchain/
│   ├── contracts/
│   │   └── Portfolio.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── Portfolio.js
│   ├── hardhat.config.js
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── config/
│   │   └── abi/
│   ├── package.json
│   └── README.md
└── README.md
```

## Prerequisites

- Node.js and npm
- MetaMask browser extension
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rohith-CY/Crypto-Portfolio-Tracker.git
cd Crypto-Portfolio-Tracker
```

### 2. Install Blockchain Dependencies

```bash
cd blockchain
npm install
```

### 3. Compile the Smart Contract

```bash
npx hardhat compile
```

### 4. Run Smart Contract Tests

```bash
npx hardhat test
```

### 5. Start the Local Blockchain

Open a separate terminal:

```bash
cd blockchain
npx hardhat node
```

Keep this terminal running.

### 6. Deploy the Smart Contract

Open another terminal:

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

The deployment script updates the frontend contract address and ABI.

### 7. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 8. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## MetaMask Configuration

Configure MetaMask to connect to the local Hardhat network:

- **Network name:** Hardhat Local
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency symbol:** ETH

Connect your wallet to the application after deployment.

**Important:** Use only test accounts and test funds on the local development network. Never use real funds with private keys printed by Hardhat.

## Testing

The smart contract test suite covers:

- Adding a holding successfully
- Rejecting an empty name
- Rejecting a zero quantity
- Keeping users' holdings separate
- Removing a holding
- Rejecting removal of a nonexistent holding

**Latest test result:** 6 passing.

## Notes

- The application is configured for local blockchain development.
- Restarting the Hardhat node resets its blockchain state; redeploy the contract before using the frontend again.
- Live cryptocurrency price integration is not included unless separately implemented.
- This project is intended for educational and development purposes.
