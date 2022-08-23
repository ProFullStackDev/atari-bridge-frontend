import { UseWalletProvider } from "use-wallet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlockchainProvider from "./context";
import Home from "./views/home";
import Staking from "./views/staking";
import NavBar from "./components/navbar";

import "./style.scss";

function App() {
    return (
        <div className="App">
            <UseWalletProvider
                autoConnect={true}
                connectors={{
                    injected: {
                        chainId: [4, 4002],
                    },
                }}
            >
                <BlockchainProvider>
                    <Router>
                        <NavBar />

                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route exact path="/stake" element={<Staking />} />
                        </Routes>
                    </Router>
                </BlockchainProvider>
            </UseWalletProvider>
        </div>
    );
}

export default App;
