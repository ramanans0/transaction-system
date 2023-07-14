import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import Link from "next/link";
import axios from "axios";


import React from 'react';

export default function Repayments() {
    const [repaymentLog, setRepaymentLog] = useState([]);
    
    // get repayment logs
    useEffect(() => {
        axios.get('/api/repayments').then(response => {
            setRepaymentLog(response.data);
        });
    }, []);

    return (
        <PageLayout>
            <table className="basic mt-2">
                <thead>
                    <tr>
                    <td className="bg-blue-300">Transaction Amount</td>
                        <td className="bg-blue-300">Transaction Type</td>
                        <td className="bg-blue-300"># of Involved Transactions</td>
                    </tr>
                </thead>
                <tbody>
                    {repaymentLog.map(transaction =>
                            <tr key={transaction._id}>
                                <td>{transaction.amount}</td>
                                <td>{transaction.type || "-"}</td>        
                                <td>{transaction.count || "-"}</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </PageLayout>
    );
}