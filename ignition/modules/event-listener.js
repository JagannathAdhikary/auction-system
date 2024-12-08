const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
    const contractAddress = config.contractAddress;
    const contractABI = require("../../artifacts/contracts/Auction.sol/Auction.json").abi;

    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    console.log(`Listening to events from contract at: ${contractAddress}`);
    contract.on("AuctionEndAttempt", (auctionId, blockTimestamp, auctionEndTime, event) => {
        console.log(`
            Auction end time: ${auctionEndTime}
            Block time: ${blockTimestamp}
            `);
    });
    // Listen to events
    contract.on("AuctionCreated", (auctionId, creator, itemRef, startPrice, endTime, event) => {
        const timeRemaining = endTime * 1000 - Date.now();
        const thisAuctionId = auctionId;
        console.log(`
            Auction Created:
            ID: ${auctionId}
            Item Ref: ${itemRef}
            Creator: ${creator}
            Start Price: ${startPrice} ETH
            End Time: ${new Date(endTime * 1000).toLocaleString()}
        `);
        setTimeout(async () => {
            try {
                const wallet = new ethers.Wallet(config.prividerPrivateAddress, provider);
                const auctionContract = new ethers.Contract(contractAddress, contractABI, wallet);
                const tx = await auctionContract.endAuction(thisAuctionId);
                await tx.wait();
                console.log(`Auction ${thisAuctionId} ended successfully`);
            } catch(e) {
                console.error(`Failed to end auction ${thisAuctionId}:`, e);
            }
        }, timeRemaining);
    });

    contract.on("BidPlaced", (auctionId, itemRef, bidder, amount, event) => {
        console.log(`
            New Bid Placed:
            Auction ID: ${auctionId}
            ItemRef: ${itemRef}
            Bidder: ${bidder}
            Amount: ${ethers.utils.formatEther(amount)} ETH
        `);
    });
    
    contract.on("BidAmountRefunded", (auctionId, itemRef, user, amount) => {
        console.log(`
            Refunded Previoud Bidder:
            Auction ID: ${auctionId}
            ItemRef: ${itemRef}
            Refunded Bidder: ${user}
            Refunded Amount: ${ethers.utils.formatEther(amount)} ETH
            `);
    });

    contract.on("AuctionEnded", (auctionId, winner, winningBid, event) => {
        console.log(`
            Auction Ended:
            Auction ID: ${auctionId}
            Winner: ${winner}
            Winning Bid: ${ethers.utils.formatEther(winningBid)} ETH
        `);
    });
}
main().catch((error) => {
    console.error("Error in event listener:", error);
    process.exit(1);
});
