import { useBlockchainContext } from "../context";
import NavBar from "../components/navbar";
import BalancePanel from "../components/home/panels";
import HistoryPanel from "../components/home/history";
import { Container } from "@mui/system";

export default function () {
    return (
        <div className="Home">
            <NavBar />
            <br />
            <br />
            <Container>
                <BalancePanel />
                <br />
                <HistoryPanel />
            </Container>
        </div>
    );
}
