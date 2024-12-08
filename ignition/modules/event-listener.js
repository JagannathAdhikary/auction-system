const { ethers } = require("hardhat");
async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = require("../../artifacts/contracts/Auction.sol/Auction.json").abi;

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    console.log(`Listening to events from contract at: ${contractAddress}`);

    // Listen to events
    contract.on("AuctionCreated", (auctionId, creator, itemRef, startPrice, endTime, event) => {
        console.log(`
            Auction Created:
            ID: ${auctionId}
            Item Ref: ${itemRef}
            Creator: ${creator}
            Start Price: ${startPrice} ETH
            End Time: ${new Date(endTime * 1000).toLocaleString()}
        `);
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
