import { mongooseConnect } from "../../lib/mongoose";
import { Credit } from "../../models/Credit";


export default async function handle(req, res) {

    const { method } = req;

    await mongooseConnect();

    // retrieve credit information
    if (method === "GET") {
        const transactionDoc = await Credit.findOne({title:"Credit"});
        // console.log(transactionDoc)
        res.json(transactionDoc);
    }
    // create new entry in the event that one is missing
    // should not be needed (sanity case)
    if (method === "POST") {
        const {amount} = req.body;
        const transactionDoc = await Credit.create({
            title:"Credit", amount:amount,
        })
        res.json(transactionDoc);
    }
    // update credit score
    if (method === "PUT") {
        const {amount} = req.body;
        const transactionDoc = await Credit.updateOne(
            {title:"Credit"}, {amount:amount}
        );
        res.json(transactionDoc);
    }
}