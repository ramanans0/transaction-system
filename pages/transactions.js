import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import Link from "next/link";
import axios from "axios";


import React from 'react';
import { useRouter } from "next/router";

export default function Transactions() {
    const [transactionLog, setTransactionLog] = useState([]);
    const router = useRouter();
    
    useEffect(() => {
        axios.get('/api/transactions').then(response => {
            setTransactionLog(response.data);
        });
    }, []);

    async function repay() {
        // retrieve record of unpaid purchases and refunds
        const transactPurchase = await axios.get('/api/transactions?statusFilter=Unpaid&typeFilter=Purchase');
        const transactRefund = await axios.get('/api/transactions?statusFilter=Unpaid&typeFilter=Refund');
        if ((transactPurchase.data.length > 0) || (transactRefund.data.length > 0)){    
            const purchase = transactPurchase.data;
            const refund = transactRefund.data;
            // update logs
            await Promise.all(purchase.map(async (transaction) => {
                await axios.put('/api/transactions', {status:"Paid", amount:transaction.amount, title: transaction.title, type:transaction.type, _id:transaction._id});
            }));
            await Promise.all(refund.map(async (transaction) => {
                await axios.put('/api/transactions', {status:"Paid", amount:transaction.amount, title: transaction.title, type:transaction.type, _id:transaction._id});
            }));
            var creditValue = (await axios.get('/api/credits')).data;
            var creditDiff = creditValue.amount - 50;
            // determine credit amount and payer
            var transactType = "User to Fizz";
            if (creditDiff > 0) {
                transactType = "Fizz to User";
            }
            creditDiff = Math.abs(creditDiff);
            const transactLength = refund.length + purchase.length;
            // perform transaction
            await axios.put('/api/credits', {amount:50});
            await axios.post('/api/repayments', {amount:creditDiff, count:transactLength, type:transactType});
        }
        location.reload();
    }

    async function refund(transactionId) {
        // await axios.delete('/api/transactions?productId='+productId)
        var transact = await axios.get('/api/transactions?transactionId='+transactionId)
        if (transact.status == 200){
            var creditValue = (await axios.get('/api/credits')).data;
            // console.log(creditValue)
            var transaction = transact.data;
            // console.log(transaction)
            var amount = creditValue.amount + transaction.amount;
            // refund transaction
            await axios.put('/api/credits', {amount});
            await axios.put('/api/transactions', {status:"Voided", amount:transaction.amount, title: transaction.title, type:transaction.type, _id:transaction._id});
            await axios.post('/api/transactions', {status:"Unpaid", amount:transaction.amount, title:transaction.title, type:"Refund"});
            // await axios.post('/api/repayments', {amount:transaction.amount, count:1, type:"Fizz to User"});
        }
        location.reload();
    }

    return (
        <PageLayout>
            <button className="bg-red-800 rounded-md text-white py-1 px-2" onClick={() => repay()}>Simulate Repayment</button>
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td className="bg-blue-300">Transaction</td>
                        <td className="bg-blue-300">Transaction Type</td>
                        <td className="bg-blue-300">Transaction Amount</td>
                        <td className="bg-blue-300">Status</td>
                        <td className="bg-blue-300"></td>
                    </tr>
                </thead>
                <tbody>
                    {transactionLog.map(transaction =>
                            <tr key={transaction._id}>
                                <td>{transaction.title}</td>
                                <td>{transaction.type || "-"}</td>
                                <td>{transaction.amount || "-"}</td>
                                {(transaction.status) && (
                                    <td>{transaction.status}</td>
                                )}
                                {((transaction.status === "Unpaid") || (transaction.status === "Paid")) && (transaction.type !== "Refund") && (
                                    <td><button className="bg-gray-900 rounded-md text-white py-1 px-2" onClick={() => refund(transaction._id)}>Refund</button></td>
                                )}
                            </tr>
                        )}
                </tbody>
            </table>
        </PageLayout>
    );
}