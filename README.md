# Auction System

This project is an auction system built using Node.js, Express, and Ethereum smart contracts. The system allows users to create and bid on auctions.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Hardhat (for compiling and deploying smart contracts)
- An Ethereum node (e.g., local Hardhat node or Infura)

## Setup

### 1. Clone the Repository

```sh
git clone https://github.com/JagannathAdhikary/auction-system.git
cd auction-system
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Start the Hardhat Node
Start the Hardhat local blockchain node:
```
npx hardhat node
```
### 4. Compile Smart Contract

```
npm run hardhat-compile
```
### 5. Deploye Smart Contract
```
npm run hardhat-deploy-local
```
Note: Contract address will be required in config.json file

### 6. Configure Environment Variables

Create a config.json file in the root directory of your project with the following content:

Example
```
{
    "rpcUrl": "http://127.0.0.1:8545",
    "contractAddress": "<CONTRACT_ADDRESS>",
    "prividerPrivateAddress":"<PRIVATE_ADDRESS>"
}
```
Note: <CONTRACT_ADDRESS> can be found from step 5 and providerPrivateAddress would be deployer of the contract (typically Account #0 in test env) paste the private address that is generated in step 3 

### 7. Start the Server and Event-listener
####  Start the Express server:
```
node ./ignition/modules/server.js
```
Note: The server will start listening on port 3322.
#### Start the Event-listener
```
node ./ignition/modules/event-listener.js
```

### API Endpoints
Register Wallet: POST /register-wallet

Register account wallets (parties involved in create-auction, bid-auction process) in the system

Create Auction: POST /create-auction

Bid Auction: POST /bid-auction

Postman Collection link: https://github.com/JagannathAdhikary/auction-system/blob/main/doc/AuctionSystem.postman_collection.json
Note: Set ENV variables required
