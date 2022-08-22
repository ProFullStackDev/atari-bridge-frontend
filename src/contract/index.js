// by Logan <https://github.com/loganworld>
// at 19/08/2022

const { ethers } = require("ethers");
const { Contract, Provider, setMulticallAddress } = require("ethers-multicall");
const Abis = require("./contracts/abis.json");
const Addresses = require("./contracts/addresses.json");
const { provider, supportChainId } = require("./providers");

const multicallAddress = process.env.MULTIADDRESS || "0x402C435EA85DFdA24181141De1DE66bad67Cdf12"; // 4002 multiaddress
setMulticallAddress("4002", multicallAddress);
const multicallProvider = new Provider(provider, supportChainId);

// make contract objects
const TANKTOKEN = new ethers.Contract(Addresses.TANKTOKEN, Abis.TANKTOKEN, provider)

module.exports = {
    provider, multicallProvider,
    TANKTOKEN
};