import React, {
    createContext,
    useContext,
    useReducer,
    useMemo,
    useEffect,
} from "react";
import { ethers } from "ethers";
import { useWallet } from "use-wallet";
import { toBigNum, fromBigNum } from "../utils";
import { TANKTOKEN } from "../contract";

// create context
const BlockchainContext = createContext();
function reducer(state, { type, payload }) {
    return {
        ...state,
        [type]: payload,
    };
}

const INIT_STATE = {
    balance: 0
};

// use contexts
export function useBlockchainContext() {
    return useContext(BlockchainContext);
}

export default function Provider({ children }) {
    const wallet = useWallet();
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    // set signer
    useEffect(() => {
        (async () => {
            if (wallet.status === "connected") {
                const provider = new ethers.providers.Web3Provider(
                    wallet.ethereum
                );
                const signer = await provider.getSigner();
                dispatch({
                    type: "signer",
                    payload: signer,
                });
                dispatch({
                    type: "provider",
                    payload: provider,
                });
            } else {
                dispatch({
                    type: "signer",
                    payload: null,
                });
            }
        })();
    }, [wallet.status])

    /* ------- blockchain interaction functions ------- */
    // interact with smart contract
    const sendERC20 = async (to, value) => {
        if(!state.signer) throw new Error("Wallet isn't connected!")
        let tx = await TANKTOKEN.connect(state.signer).transfer(to, toBigNum(value, 18));
        return tx;
    }
    // interact with blockchain - send native coin
    const sendETH = async (to, value) => {
        if(!state.signer) throw new Error("Wallet isn't connected!")
        let tx = await state.signer.sendTransaction({ to: to, value: toBigNum(value, 18) });
        return tx;
    }

    return (
        <BlockchainContext.Provider
            value={useMemo(
                () => [
                    state,
                    {
                        dispatch,
                        sendERC20,
                        sendETH
                    },
                ],
                [state]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
