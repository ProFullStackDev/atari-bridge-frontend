import { useState } from "react";

export default function HistoryPanel() {
    const [data, setData] = useState([0, 1, 2, 1, 2, 1, 2]);

    return (
        <div className="History">
            <h1>Transaction</h1>

            <div className={data.length > 5 ? "table scroll" : "table"}>
                {data.map((item) => (
                    <span>
                        <p id="balance">{item}</p>
                    </span>
                ))}
            </div>
        </div>
    );
}
