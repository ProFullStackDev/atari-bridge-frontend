import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useBlockchainContext } from "../../context";

export default function BalancePanel() {
    const wallet = useWallet();

    const [state, { sendERC20, tokenApprove }] = useBlockchainContext();
    const [amount, setAmount] = useState(0);
    const [chain, setChain] = useState("1");
    const [approveFlag, setApproveFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (state.approvedBalance >= amount) {
            setApproveFlag(true);
        } else {
            setApproveFlag(false);
        }

        if (amount < 0 || amount === "") {
            setAmount(0);
        }
    }, [state, amount]);

    const HandleSend = async () => {
        try {
            if (wallet.status === "connected") {
                setLoading(true);
                const result = await sendERC20(chain, amount);

                if (result) {
                    alert("Successfully Sent");
                    setLoading(false);
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const HandleApprove = async () => {
        try {
            if (wallet.status === "connected") {
                setLoading(true);
                const result = await tokenApprove({ amount: amount });

                if (result) {
                    alert("Successfully Approve");
                    setLoading(false);
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="Panel">
            <h1>Bridge</h1>

            <span>
                <label htmlFor="balance">Balance : </label>
                <p id="balance">{state.tokenBalance}</p>
            </span>
            <span>
                <label htmlFor="amount">Amount : </label>
                <input
                    type={"number"}
                    id={"amount"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </span>
            <span>
                <label htmlFor="chain">Select Chain: </label>
                <select
                    id="chain"
                    onChange={(e) => setChain(e.target.value)}
                    defaultValue="1"
                >
                    <option value={"4"}>Rinkby</option>
                    <option value={"4002"}>Fantom</option>
                </select>
            </span>

            {wallet.status === "connected" ? (
                loading ? (
                    <button>
                        <div className="loader"></div>
                    </button>
                ) : approveFlag ? (
                    <button onClick={HandleSend}>Exchange</button>
                ) : (
                    <button onClick={HandleApprove}>Approve</button>
                )
            ) : null}
        </div>
    );
}
