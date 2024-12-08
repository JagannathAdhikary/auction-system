require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.18",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545"
        }
        // goerli: {
        //     url: `https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
        //     accounts: [`0x${YOUR_PRIVATE_KEY}`]
        // }
    }
};
