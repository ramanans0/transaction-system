import Nav from "./Nav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PageLayout({children}) {
    const [creditStatus, setCreditStatus] = useState(0);

    useEffect(() => {
        axios.get('/api/credits').then(response => {
            setCreditStatus(response.data);
        });
    }, []);

    return (
        <div className="bg-gray-600 min-h-screen flex">
            <Nav {...creditStatus} />
            <div className="bg-blue-100 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
                {children}
            </div>

        </div>
    )
}
