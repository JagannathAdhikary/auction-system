const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Auction Contract', function () {
    let Auction, auction, owner, addr1, addr2;

    beforeEach(async function () {
        Auction = await ethers.getContractFactory('Auction');
        [owner, addr1, addr2, _] = await ethers.getSigners();
        auction = await Auction.deploy();
        await auction.deployed();
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await auction.owner()).to.equal(owner.address);
        });
    });

    describe('Create Auction', function () {
        it('Should create an auction', async function () {
            await auction.connect(addr1).createAuction('item1', ethers.utils.parseEther('1'), 3600);
            const auctionItem = await auction.auctions(0);
            expect(auctionItem.itemRef).to.equal('item1');
            expect(auctionItem.startPrice).to.equal(ethers.utils.parseEther('1'));
            expect(auctionItem.creator).to.equal(addr1.address);
        });
    });

    describe('Place Bid', function () {
        it('Should place a bid', async function () {
            await auction.connect(addr1).createAuction('item1', ethers.utils.parseEther('1'), 3600);
            await auction.connect(addr2).placeBid(0, { value: ethers.utils.parseEther('2') });
            const auctionItem = await auction.auctions(0);
            expect(auctionItem.highestBid).to.equal(ethers.utils.parseEther('2'));
            expect(auctionItem.highestBidder).to.equal(addr2.address);
        });

        it('Should fail if bid is lower than highest bid', async function () {
            await auction.connect(addr1).createAuction('item1', ethers.utils.parseEther('1'), 3600);
            await auction.connect(addr2).placeBid(0, { value: ethers.utils.parseEther('2') });
            await expect(
                auction.connect(addr2).placeBid(0, { value: ethers.utils.parseEther('1') })
            ).to.be.revertedWith('Bid must be higher than the current highest bid');
        });

        it('Should fail if auction has ended', async function () {
            await auction.connect(addr1).createAuction('item1', ethers.utils.parseEther('1'), 1);
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait for auction to end
            await expect(
                auction.connect(addr2).placeBid(0, { value: ethers.utils.parseEther('2') })
            ).to.be.revertedWith('Auction has ended');
        });
    });
});