import { useWallet } from "use-wallet";

const NavBar = () => {
    const wallet = useWallet();
    const connectToMetamask = async () => {
        wallet.connect();
    };

    const disconnect = async () => {
        wallet.reset();
    };

    return (
        <div className="Wallet-connect-panel">
            <div>
                <h1>Logo</h1>
                {wallet.status != "connected" ? (
                    <button className="Connect-btn" onClick={connectToMetamask}>
                        connect wallet
                    </button>
                ) : (
                    <button className="Connect-btn" onClick={disconnect}>
                        disconnect
                    </button>
                )}
            </div>
        </div>
    );
};

export default NavBar;
