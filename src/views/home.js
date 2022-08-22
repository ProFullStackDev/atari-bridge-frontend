import { useBlockchainContext } from "../context";
import NavBar from "../components/navbar"
import { BalancePanel } from "../components/home/panels"

export default function () {
    return (
        <div className="Home">
            <NavBar />
            <div className='Panels'>
                <BalancePanel />
                <div className="Panel">
                    sdfsdf
                </div>
            </div>
        </div>
    )
}