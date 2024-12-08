const { expect } = require("chai");

describe("Auction", function () {
    it("Should deploy the contract", async function () {
        const Auction = await ethers.getContractFactory("Auction");
        const auction = await Auction.deploy();
        await auction.deployed();

        expect(auction.address).to.properAddress;
    });
});