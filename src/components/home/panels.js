import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useBlockchainContext } from "../../context";

export default function BalancePanel() {
    const wallet = useWallet();

    const [state, { sendERC20, tokenApprove, getAllowance, getBalance }] =
        useBlockchainContext();
    const [amount, setAmount] = useState(0);
    const [chain, setChain] = useState("0");
    const [approveFlag, setApproveFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setChain("0");
    }, [wallet.chainId]);

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
                    getAllowance();
                    getBalance();
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
                    getAllowance();
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="Panel">
            <div className="chain">
                <h3>
                    Chain:{" "}
                    <b>
                        {wallet.status === "connected"
                            ? wallet.networkName
                            : "Unsupported Chain"}
                    </b>
                </h3>
            </div>
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
                <select id="chain" onChange={(e) => setChain(e.target.value)}>
                    <option value={"0"}>select chain</option>
                    {wallet.chainId !== 4 && (
                        <option value={"4"}>Rinkby</option>
                    )}
                    {wallet.chainId !== 4002 && (
                        <option value={"4002"}>Fantom</option>
                    )}
                </select>
            </span>

            {wallet.status === "connected" ? (
                loading ? (
                    <button>
                        <div className="loader"></div>
                    </button>
                ) : approveFlag ? (
                    <button
                        onClick={HandleSend}
                        disabled={state.tokenBalance === 0 || chain === "0"}
                    >
                        Exchange
                    </button>
                ) : (
                    <button onClick={HandleApprove}>Approve</button>
                )
            ) : null}
        </div>
    );
}
