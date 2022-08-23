import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import axios from "axios";
import { Explorers } from "../../contract";

import {
    TableCell,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core/";

const columns = [
    {
        id: "fromChain",
        label: "FromChain",
        minWidth: 70,
        format: (value) => value,
    },
    {
        id: "toChain",
        label: "ToChain",
        minWidth: 70,
        format: (value) => value,
    },
    {
        id: "amount",
        label: "Amount",
        minWidth: 70,
        format: (value) => value,
    },
    {
        id: "fromHash",
        label: "FromHash",
        minWidth: 100,
        format: (value, fromChain, toChain) => (
            <a href={Explorers[fromChain] + value}>
                {value.slice(0, 4) + "..." + value.slice(-4)}
            </a>
        ),
    },
    {
        id: "toHash",
        label: "ToHash",
        minWidth: 100,
        format: (value, fromChain, toChain) => (
            <a href={Explorers[toChain] + value}>
                {value.slice(0, 4) + "..." + value.slice(-4)}
            </a>
        ),
    },
    {
        id: "status",
        label: "Status",
        minWidth: 70,
        format: (value) => value,
    },
];

export default function HistoryPanel() {
    const wallet = useWallet();
    const [data, setData] = useState(null);
    var interveralId = null;

    const getTx = async () => {
        if (wallet.status === "connected") {
            try {
                const result = await axios.post(
                    process.env.REACT_APP_SERVERURL + "/get-txs",
                    { userAddress: wallet.account }
                );

                setData(result.data.data);
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    useEffect(() => {
        if (interveralId != null) clearInterval(interveralId);
        if (wallet.status === "connected") {
            interveralId = setInterval(getTx, 5000);
        }
    }, [wallet.status, getTx]);

    return (
        <div className="History">
            <h1>Transaction</h1>

            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item, index) => {
                            return (
                                <TableRow role="checkbox" key={index}>
                                    {columns.map((column, index) => {
                                        const value = item[column.id];
                                        return (
                                            <TableCell key={index}>
                                                {column.format(
                                                    value,
                                                    item["fromChain"],
                                                    item["toChain"]
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
