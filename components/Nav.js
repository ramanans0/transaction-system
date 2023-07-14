'use client'

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Nav({creditStatus}) {
    const deadLink = "flex gap-2";
    const liveLink = deadLink + " bg-blue-100 rounded-sm text-black p-1";

    const router = useRouter();
    const { pathname } = router;
    const [creditLog, setCreditLog] = useState(0);

    useEffect(() => {
        axios.get('/api/credits').then(response => {
            setCreditLog(response.data);
            if (!response.data) {
                updateCredit();
            }
        });
    }, []);

    async function updateCredit(){
        const dataPackage = {amount:50};
        await axios.post('/api/credits', dataPackage);
    }

    return (
        <aside className="text-gray-200 p-4">
            <Link href={'/transactions'} className="flex gap-2 mb-8 mr-4">
                <span className="">
                    Fizz Credit
                </span>
            </Link>
            <nav className="flex flex-col gap-2">
                <Link href={'/'} className={pathname==="/"?liveLink:deadLink}>
                    Make Purchase
                </Link>
                <Link href={'/transactions'} className={pathname.includes("/transactions")?liveLink:deadLink}>
                    Past transactions
                </Link>
                <Link href={'/repayments'} className={pathname.includes("/repayments")?liveLink:deadLink}>
                    Past repayments
                </Link>
            </nav>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="bg-blue-100 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4 text-black">
                Current Credit
                {creditLog && (
                    <div className="bg-white flex-grow mt-2">
                        ${creditLog.amount.toFixed(2)}
                    </div>
                )}
            </div>
        </aside>
    );
}