import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useBlockchainContext } from "../../context";

export default function BalancePanel() {
    const wallet = useWallet();

    const [
        state,
        {
            getStakingAllowance,
            getStakedAmount,
            stakingApprove,
            stake,
            unstake,
        },
    ] = useBlockchainContext();
    const [amount, setAmount] = useState(0);
    const [approveFlag, setApproveFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (state.stakingApproveBalance >= amount) {
            setApproveFlag(true);
        } else {
            setApproveFlag(false);
        }

        if (amount < 0 || amount === "") {
            setAmount(0);
        }
    }, [state, amount]);

    const HandleApprove = async () => {
        try {
            if (wallet.status === "connected") {
                setLoading(true);
                const result = await stakingApprove({ amount: amount });

                if (result) {
                    alert("Successfully Approve");
                    setLoading(false);
                    getStakingAllowance();
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const HandleStake = async () => {
        try {
            if (wallet.status === "connected") {
                setLoading(true);
                const result = await stake({ amount: amount });

                if (result) {
                    alert("Successfully Stake");
                    setLoading(false);
                    getStakingAllowance();
                    getStakedAmount();
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const HandleUnstake = async () => {
        try {
            if (wallet.status === "connected") {
                setLoading(true);
                const result = await unstake({ amount: amount });

                if (result) {
                    alert("Successfully Unstake");
                    setLoading(false);
                    getStakingAllowance();
                    getStakedAmount();
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="Stake">
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
            <h1>Staking</h1>

            <span>
                <label htmlFor="balance">APY :</label>
                <p id="balance">{state.rewardRate}</p>
            </span>
            <span>
                <label htmlFor="balance">Staked :</label>
                <p id="balance">{state.stakedAmount}</p>
            </span>
            <span>
                <label htmlFor="balance">Balance :</label>
                <p id="balance">{state.tokenBalance}</p>
            </span>
            <span>
                <label htmlFor="amount">Amount :</label>
                <input
                    type={"number"}
                    id={"amount"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </span>

            {wallet.status === "connected" ? (
                <div className="button_group">
                    {loading ? (
                        <button>
                            <div className="loader"></div>
                        </button>
                    ) : (
                        <button disabled={approveFlag} onClick={HandleApprove}>
                            Approve
                        </button>
                    )}
                    {loading ? (
                        <button>
                            <div className="loader"></div>
                        </button>
                    ) : (
                        <button disabled={!approveFlag} onClick={HandleStake}>
                            Stake
                        </button>
                    )}
                    {loading ? (
                        <button>
                            <div className="loader"></div>
                        </button>
                    ) : (
                        <button
                            onClick={HandleUnstake}
                            disabled={state.stakedAmount < amount}
                        >
                            UnStake
                        </button>
                    )}
                </div>
            ) : null}
        </div>
    );
}
