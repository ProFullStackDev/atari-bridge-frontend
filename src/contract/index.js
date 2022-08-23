// by Logan <https://github.com/loganworld>
// at 19/08/2022

const { ethers } = require("ethers");
const Abis = require("./contracts/abis.json");
const Addresses = require("./contracts/addresses.json");
const { provider, supportChainId } = require("./providers");

// make contract objects
const TreasuryContract = new ethers.Contract(
    Addresses[supportChainId].treasury,
    Abis.treasury,
    provider
);

const TokenContract = new ethers.Contract(
    Addresses[supportChainId].token,
    Abis.token,
    provider
);

module.exports = {
    provider,
    TreasuryContract,
    TokenContract,
};
