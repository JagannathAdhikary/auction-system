const { expect } = require("chai");

describe("Auction Contract", function () {
    let Auction, auction, owner;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Auction = await ethers.getContractFactory("Auction");
        [owner] = await ethers.getSigners();

        // Deploy the contract before each test
        auction = await Auction.deploy();
        await auction.deployed();
    });

    it("Should deploy the contract successfully", async function () {
        expect(auction.address).to.properAddress;
    });

    it("Should set the owner correctly", async function () {
        const contractOwner = await auction.owner(); // Assuming the contract has an `owner` variable
        expect(contractOwner).to.equal(owner.address);
    });
});
