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
import { TokenContract, TreasuryContract } from "../contract";

// create context
const BlockchainContext = createContext();
function reducer(state, { type, payload }) {
    return {
        ...state,
        [type]: payload,
    };
}

const INIT_STATE = {
    tokenBalance: 0,
    approvedBalance: 0,
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
        if (wallet.status === "connected") {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer = provider.getSigner();

            dispatch({
                type: "signer",
                payload: signer,
            });
            dispatch({
                type: "provider",
                payload: provider,
            });

            getBalance();
            getAllowance();
        } else {
            dispatch({
                type: "signer",
                payload: null,
            });
        }
    }, [wallet.status]);

    /* ------- blockchain interaction functions ------- */
    // get token balance
    const getBalance = async () => {
        if (wallet.status === "connected") {
            let tx = await TokenContract.balanceOf(wallet.account);

            dispatch({
                type: "tokenBalance",
                payload: fromBigNum(tx, 8),
            });
        }
    };

    const getAllowance = async () => {
        if (wallet.status === "connected") {
            let tx = await TokenContract.allowance(
                wallet.account,
                TreasuryContract.address
            );

            dispatch({
                type: "approvedBalance",
                payload: fromBigNum(tx, 18),
            });
        }
    };

    // interact with smart contract
    const sendERC20 = async (chain, amount) => {
        let tx = await TreasuryContract.connect(state.signer).deposit(
            toBigNum(amount, 8),
            chain
        );

        return tx;
    };

    const tokenApprove = async (props) => {
        const { amount } = props;
        let tx = await TokenContract.connect(state.signer).approve(
            TreasuryContract.address,
            toBigNum(amount, 8)
        );

        getAllowance();
        return tx;
    };

    return (
        <BlockchainContext.Provider
            value={useMemo(
                () => [
                    state,
                    {
                        dispatch,
                        sendERC20,
                        getBalance,
                        tokenApprove,
                    },
                ],
                [state, sendERC20, tokenApprove]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
