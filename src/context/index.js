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
import { Treasuries, Tokens, Stakes } from "../contract";

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
    stakingApproveBalance: 0,
    stakedAmount: 0,
    rewardRate: 0,
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
            getStakingAllowance();
            getStakedAmount();
            rewardRate();
        } else {
            dispatch({
                type: "signer",
                payload: null,
            });
        }
    }, [wallet.status, wallet.chainId]);

    /* ------- blockchain interaction functions ------- */
    // get token balance
    const getBalance = async () => {
        try {
            if (wallet.status === "connected") {
                let tx = await Tokens[wallet.chainId].balanceOf(wallet.account);

                dispatch({
                    type: "tokenBalance",
                    payload: fromBigNum(tx, 8),
                });
            }
        } catch (err) {
            dispatch({
                type: "tokenBalance",
                payload: 0,
            });
        }
    };

    const getAllowance = async () => {
        try {
            if (wallet.status === "connected") {
                let tx = await Tokens[wallet.chainId].allowance(
                    wallet.account,
                    Treasuries[wallet.chainId].address
                );

                dispatch({
                    type: "approvedBalance",
                    payload: fromBigNum(tx, 8),
                });
            }
        } catch (err) {
            dispatch({
                type: "approvedBalance",
                payload: 0,
            });
        }
    };

    const getStakingAllowance = async () => {
        try {
            if (wallet.status === "connected") {
                let tx = await Tokens[wallet.chainId].allowance(
                    wallet.account,
                    Stakes[wallet.chainId].address
                );
                dispatch({
                    type: "stakingApproveBalance",
                    payload: fromBigNum(tx, 8),
                });
            }
        } catch (err) {
            dispatch({
                type: "stakingApproveBalance",
                payload: 0,
            });
        }
    };

    const getStakedAmount = async () => {
        try {
            if (wallet.status === "connected") {
                let tx = await Stakes[wallet.chainId].getLockedAmount(
                    wallet.account
                );

                dispatch({
                    type: "stakedAmount",
                    payload: fromBigNum(tx, 8),
                });
            }
        } catch (err) {
            dispatch({
                type: "stakedAmount",
                payload: 0,
            });
        }
    };

    const rewardRate = async () => {
        if (wallet.status === "connected") {
            let tx = await Stakes[wallet.chainId].rewardRate();

            dispatch({
                type: "rewardRate",
                payload: (fromBigNum(tx, 0) * 3600 * 24 * 365) / 10 ** 13,
            });
        }
    };

    // interact with smart contract of token and treasury
    const sendERC20 = async (toChainId, amount) => {
        let tx = await Treasuries[wallet.chainId]
            .connect(state.signer)
            .deposit(toBigNum(amount, 8), toChainId);

        return tx;
    };

    const tokenApprove = async (props) => {
        const { amount } = props;
        let tx = await Tokens[wallet.chainId]
            .connect(state.signer)
            .approve(Treasuries[wallet.chainId].address, toBigNum(amount, 8));

        return tx;
    };

    // interact with smart contract of staking
    const stakingApprove = async (props) => {
        const { amount } = props;
        let tx = await Tokens[wallet.chainId]
            .connect(state.signer)
            .approve(Stakes[wallet.chainId].address, toBigNum(amount, 8));

        return tx;
    };

    const stake = async (props) => {
        const { amount } = props;
        let tx = await Stakes[wallet.chainId]
            .connect(state.signer)
            .stake(toBigNum(amount, 8));

        return tx;
    };

    const unstake = async (props) => {
        const { amount } = props;
        let tx = await Stakes[wallet.chainId]
            .connect(state.signer)
            .unstake(toBigNum(amount, 8));

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
                        getAllowance,
                        getStakingAllowance,
                        stakingApprove,
                        stake,
                        unstake,
                        getStakedAmount,
                    },
                ],
                [
                    state,
                    sendERC20,
                    tokenApprove,
                    getAllowance,
                    getBalance,
                    getStakingAllowance,
                    stakingApprove,
                    stake,
                    unstake,
                    getStakedAmount,
                ]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
