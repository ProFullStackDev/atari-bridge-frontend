// by Logan <https://github.com/loganworld>
// at 19/08/2022

require("dotenv").config();
import * as ethers from "ethers";

const supportChainIds = [
    process.env.REACT_APP_CHAINID1 || "4",
    process.env.REACT_APP_CHAINID2 || "4002",
    // process.env.CHAINID3 || "31337"
];

const RPCS = {
    // 1: "http://13.59.118.124/eth",
    // 250: "https://rpc.ftm.tools/",
    4: "http://85.206.160.196",
    4002: "https://ftm-test.babylonswap.finance",
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
};

const Explorers = {
    // 1: "http://13.59.118.124/eth",
    // 250: "https://rpc.ftm.tools/",
    4: "https://rinkeby.etherscan.io/tx/",
    4002: "https://testnet.ftmscan.com/tx/",
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
};

const providers = {
    // 1: new ethers.providers.JsonRpcProvider(RPCS[1]),
    4: new ethers.providers.JsonRpcProvider(RPCS[4]),
    // 250: new ethers.providers.JsonRpcProvider(RPCS[250]),
    4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337]),
};

export { supportChainIds, providers, Explorers };
