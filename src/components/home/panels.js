import { useEffect, useState } from "react";
// import { ethers } from "ethers";
import { useWallet } from "use-wallet";

import { useBlockchainContext } from "../../context";
import { fromBigNum } from "../../utils";

export default function BalancePanel() {
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
            payload: fromBigNum(balance),
        });
    };

    useEffect(() => {
        if (!!state.provider && wallet.status == "connected") checkBalance();
    }, [state.provider]);

    const sendCoin = async () => {
        try {
            var tx = await sendETH(toAddress, amount);
            setRes("transaction submitted with ", tx.hash);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="Panel">
            <h1>Bridge</h1>

            <span>
                <label htmlFor="balance">Balance : </label>
                <p id="balance">{state.balance}</p>
            </span>
            <span>
                <label htmlFor="amount">Amount : </label>
                <input
                    type={"number"}
                    id={"amount"}
                    className="AddressInput"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                />
            </span>
            <span>
                <label htmlFor="chain">Select Chain: </label>
                <select id="chain">
                    <option>1</option>
                    <option>2</option>
                </select>
            </span>

            {error && <div className="message">{error}</div>}

            <button onClick={sendCoin}>SEND ETH</button>
        </div>
    );
}
