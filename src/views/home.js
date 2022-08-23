import styled from "styled-components";
import NavBar from "../components/navbar";
import BalancePanel from "../components/home/panels";
import HistoryPanel from "../components/home/history";

const Container = styled.div`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-right: auto;
    margin-left: auto;

    @media (min-width: 576px) {
        max-width: 540px;
        padding-right: 0.5rem;
        padding-left: 0.5rem;
    }
    @media (max-width: 768px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
    }
    @media (min-width: 768px) {
        max-width: 720px;
    }
    @media (min-width: 992px) {
        max-width: 960px;
    }
    @media (min-width: 1300px) {
        max-width: 1200px;
    }
`;

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
