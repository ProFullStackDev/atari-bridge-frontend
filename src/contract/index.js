// by Logan <https://github.com/loganworld>
// at 19/08/2022

import * as ethers from "ethers";
import Abis from "./contracts/abis.json";
import Addresses from "./contracts/addresses.json";
import { providers, supportChainIds } from "./providers";

// make contract objects
var Treasuries = {};
var Tokens = {};

supportChainIds.map((supportChainId) => {
    Treasuries = {
        ...Treasuries,
        [supportChainId]: new ethers.Contract(
            Addresses[supportChainId].treasury,
            Abis.treasury,
            providers[supportChainId]
        ),
    };

    Tokens = {
        ...Tokens,
        [supportChainId]: new ethers.Contract(
            Addresses[supportChainId].token,
            Abis.token,
            providers[supportChainId]
        ),
    };
});

export { Treasuries, Tokens };
