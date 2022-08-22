import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "use-wallet";

import { useBlockchainContext } from "../../context";
import "./home.css";
import { fromBigNum } from "../../utils";

const Column = ({ children }) => {
    return (
        <div className="Column">
            {children}
        </div>
    )
}

export const BalancePanel = () => {
    const wallet = useWallet();

    const [state, { dispatch, sendERC20, sendETH }] = useBlockchainContext();
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState(0);

    const [error, setError] = useState();
    const [res, setRes] = useState();

    const checkBalance = async () => {
        const balance = await state.provider.getBalance(wallet.account);
        dispatch({
            type: "balance",
            payload: fromBigNum(balance)
        })
    }

    useEffect(() => {
        if (wallet.status == "connected")
            checkBalance();
    }, [wallet.status])

    const sendCoin = async () => {
        try {
            var tx = await sendETH(toAddress, amount);
            setRes("transaction submitted with ", tx.hash);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="Panel">
            <div className='Center'>check balance</div>
            <Column>
                <span className="Label">Balance : </span>
                {state.balance}
            </Column>
            <Column>
                <span className="Label">Send to : </span>
                <input className="AddressInput" value={toAddress} onChange={(e) => setToAddress(e.target.value)}></input>
            </Column>
            <Column>
                <span className="Label">Amount : </span>
                <input className="AddressInput" value={amount} onChange={(e) => setAmount(e.target.value)}></input>
            </Column>
            {res && (
                <Column>
                    <span className="Label">Result : </span>
                    {res}
                </Column>
            )}

            {error && (
                <Column>
                    <span className="Label Error">Error : </span>
                    {error}
                </Column>
            )}

            <div className='Center'>
                <button onClick={sendCoin}>sendETH</button>
            </div>
        </div>
    )
}