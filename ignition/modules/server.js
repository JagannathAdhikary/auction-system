const express = require("express");
const { ethers } = require("ethers");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
const contractAddress = config.contractAddress;
const contractABI = require("../../artifacts/contracts/Auction.sol/Auction.json").abi;

const accountMap = new Map();

const app = express();
app.use(express.json())

app.post("/register-wallet", async(req, res) => {
    const {account, privateAddress} = req.body;
    try{
        accountMap.set(account, privateAddress);
        res.status(200).send({
            message: "Wallet registered successfully"
        });
    } catch(error) {
        res.status(500).send({message: "Couldn't register wallet information"});
    }
});

app.post("/create-auction", async(req, res) => {
    try{
        const {address, startPrice, duration, itemRef} = req.body;
        const privateAddress = accountMap.get(address);
        const wallet = new ethers.Wallet(privateAddress, provider);
        const auctionContract = new ethers.Contract(contractAddress, contractABI, wallet);

        const tx = await auctionContract.createAuction(itemRef, startPrice, duration);
        await tx.wait();

        console.log("Auction created successfully:", tx.hash);

        return res.json({ success: true, transactionHash: tx.hash });
    } catch (error) {
        console.error("Error creating auction:", error);
        return res.status(500).json({ error: "Failed to create auction" });
  }
});

app.post("/bid-auction", async (req, res) => {
    try {
        const { address, auctionId, bidAmount } = req.body;
        const privateAddress = accountMap.get(address);
        const wallet = new ethers.Wallet(privateAddress, provider);
        const auctionContract = new ethers.Contract(contractAddress, contractABI, wallet);

        const tx = await auctionContract.placeBid(auctionId, { value: ethers.utils.parseEther(bidAmount.toString()) });
        await tx.wait();

        console.log("Bid placed successfully:", tx.hash);

        return res.json({ success: true, transactionHash: tx.hash });
    } catch (error) {
        console.error("Error placing bid:", error);
        return res.status(500).json({ error: "Failed to place bid" });
    }
});

const PORT = 3322;
app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);
});