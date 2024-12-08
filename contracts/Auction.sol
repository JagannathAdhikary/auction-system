// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Auction {
    address public owner;
    uint256 public auctionCount;

    struct AuctionItem {
        string itemRef;
        address payable creator;
        uint256 startPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;  //In Seconds
        bool ended;
    }

    mapping(uint256 => AuctionItem) public auctions;

    event AuctionCreated(uint256 auctionId, address indexed creator, string itemRef, uint256 startPrice, uint256 endTime);
    event BidPlaced(uint256 auctionId, string itemRef, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address indexed winner, uint256 winningBid);
    event FundsWithdrawn(address indexed user, uint256 amount);
    event BidAmountRefunded(uint256 auctionId, string itemRef, address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this");
        _;
    }

    modifier onlyCreator(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].creator, "Can only be performed by Auction creator");
        _;
    }

    modifier auctionActive(uint256 auctionId) {
        require(block.timestamp < auctions[auctionId].endTime, "Auction has ended");
        require(!auctions[auctionId].ended, "Auction is already ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createAuction(string memory itemRef, uint256 startPrice, uint256 duration) external {
        uint256 auctionId = auctionCount++;
        uint256 endTime = block.timestamp + duration;

        AuctionItem memory newAuction = AuctionItem({
            itemRef: itemRef,
            creator: payable(msg.sender),
            startPrice: startPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            endTime: endTime,
            ended: false
        });

        auctions[auctionId] = newAuction;

        emit AuctionCreated(auctionId, msg.sender, itemRef, startPrice, endTime);
    }

    function placeBid(uint256 auctionId) external payable auctionActive(auctionId) {
        require(auctions[auctionId].creator != msg.sender, "Auction owner cannot bid");

        AuctionItem storage auction = auctions[auctionId];

        require(msg.value > auction.highestBid, "Bid must be higher than the current highest bid");

        if (auction.highestBid > 0) {
            (bool success, ) = auction.highestBidder.call{value: auction.highestBid}("");
            require(success, "Transfer to previous highest bidder failed");
            emit BidAmountRefunded(auctionId, auction.itemRef, auction.highestBidder, auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit BidPlaced(auctionId, auction.itemRef, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external auctionActive(auctionId) {
        AuctionItem storage auction = auctions[auctionId];

        require(block.timestamp >= auction.endTime, "Auction has not ended yet");

        auction.ended = true;

        // Transfer the highest bid to the auction creator
        auction.creator.transfer(auction.highestBid);

        emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
    }

    // Function to withdraw funds for unsuccessful bidders
    // function withdrawFunds() external {
    //     uint256 amount = pendingReturns[msg.sender];
    //     require(amount > 0, "No funds to withdraw");

    //     pendingReturns[msg.sender] = 0;
    //     payable(msg.sender).transfer(amount);

    //     emit FundsWithdrawn(msg.sender, amount);
    // }
}
