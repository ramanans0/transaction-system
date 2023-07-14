import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import React from "react";

export const Popup = ({ closePopup }) => {
    return (
        <div className="popup-container">
        <div className="popup-body">
        <br></br>
        <h1 className="text-red-900">WARNING: </h1>
        <h1>Purchase exceeds credit limit!</h1>
        <br></br>
        <button onClick={closePopup} className="btn-action">Close X</button>
        </div>
        </div>
    );
};

export default function PurchaseForm () {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [overCredit, setOverCredit] = useState(false);
    const [transactionReturn, setTransactionReturn] = useState(false);
    const router = useRouter();

    async function createTransaction(eventHandle) {
        eventHandle.preventDefault();
        const dataPackage = {title:title, amount:amount, type:"Purchase", status:"Unpaid"};
        await axios.get('/api/credits').then(response => {
            var creditLog = response.data;
            // ensures all data is submitted
            if (response.data && amount && title) {
                var newCredit = Number(creditLog.amount) - Number(amount);
                // checks to see if credit limit crossed
                if (newCredit >= 0) {
                    axios.post('/api/transactions', dataPackage);
                    updateCredit(newCredit);
                    setTransactionReturn(true);
                }
                else {
                    setTitle('');
                    setAmount('');
                    setOverCredit(true);
                }
            }
        });
    }
    if (transactionReturn) {
        returnToTransaction();
    }

    function updateCredit(creditAmount){
        // console.log(creditAmount)
        const creditPackage = {amount:creditAmount};
        axios.put('/api/credits', creditPackage);
    }

    function returnToTransaction() {
        location.reload()
    }

    return (
        <>
            {overCredit && <Popup closePopup={() => {setOverCredit(false);location.reload()}} />}
            <form onSubmit={createTransaction}>
                <label>Transaction</label>
                <input type="text" 
                    placeholder="Desired transaction..."
                    value={title} 
                    onChange={nVal => setTitle(nVal.target.value)}
                />
                <label>Price (USD)</label>
                <input type="number" 
                    placeholder="$"
                    value={amount}
                    onChange={pVal => setAmount(pVal.target.value)} 
                />
                <div className="flex gap-2">
                    <button type="submit" className="btn-save">Simulate Purchase</button>
                </div>
            </form>
        </>
    );
}