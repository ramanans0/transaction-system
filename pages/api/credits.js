import { mongooseConnect } from "../../lib/mongoose";
import { Credit } from "../../models/Credit";


export default async function handle(req, res) {

    const { method } = req;

    await mongooseConnect();

    if (method === "GET") {
        const transactionDoc = await Credit.findOne({title:"Credit"});
        // console.log(transactionDoc)
        res.json(transactionDoc);
    }
    if (method === "POST") {
        const {amount} = req.body;
        const transactionDoc = await Credit.create({
            title:"Credit", amount:amount,
        })
        res.json(transactionDoc);
    }
    if (method === "PUT") {
        const {amount} = req.body;
        const transactionDoc = await Credit.updateOne(
            {title:"Credit"}, {amount:amount}
        );
        res.json(transactionDoc);
    }
}