import { useWallet } from "use-wallet";
import "./navbar.css";
const NavBar = () => {
    const wallet = useWallet();
    const connectToMetamask = async () => {
        wallet.connect();
    }
    const connectToWalletConnect = async () => {
        wallet.connect("walletconnect");
    }

    const disconnect = async () => {
        wallet.reset();
    }

    return (
        <div className="Wallet-connect-panel">
            {wallet.status != "connected" ? (
                <div>
                    <button className="Connect-btn" onClick={connectToMetamask}>
                        connect wallet
                    </button>
                    <button className="Connect-btn" onClick={connectToWalletConnect}>
                        connect to wallet connect
                    </button>
                </div>) : (
                <div>
                    <button className="Connect-btn" onClick={disconnect}>
                        disconnect
                    </button>
                </div>
            )}
        </div>
    )
}

export default NavBar;