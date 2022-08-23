import { UseWalletProvider } from "use-wallet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlockchainProvider from "./context";
import Home from "./views/home";

import "./style.scss";

function App() {
    return (
        <div className="App">
            <UseWalletProvider
                connectors={{
                    injected: {
                        chainId: [1, 4, 4002],
                    },
                }}
            >
                <BlockchainProvider>
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                        </Routes>
                    </Router>
                </BlockchainProvider>
            </UseWalletProvider>
        </div>
    );
}

export default App;
