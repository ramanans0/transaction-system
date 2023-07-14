import { mongooseConnect } from "../../lib/mongoose";
import { Transaction } from "../../models/transaction";


export default async function handle(req, res) {

    const { method } = req;
    await mongooseConnect();

    // retrieves entry information based on transaction id, or filters
    if (method === "GET") {
        if (req.query?.transactionId) {
            // console.log(req.query?.transactionId)
            const transact = await Transaction.findOne({_id:req.query.transactionId})
            // console.log(transact)
            res.json(transact);
        }
        else if (req.query?.statusFilter) {
            // console.log(req.query?.transactionId)
            // statusFilter=Unpaid&typeFilter=Refund
            const transact = await Transaction.find({status:req.query.statusFilter, type:req.query.typeFilter})
            // console.log(transact)
            res.json(transact);
        }
        else {
            res.json(await Transaction.find());
        }
    }
    // create new transaction
    if (method === "POST") {
        const {title, amount, type, status} = req.body;
        const transactionDoc = await Transaction.create({
            title, amount, type, status,
        })
        res.json(transactionDoc);
    }
    // update transaction using id
    if (method === "PUT") {
        const {title, amount, status, type, _id} = req.body;
        const transactionDoc = await Transaction.updateOne(
            {_id}, {title, amount, status, type}
        );
        res.json(transactionDoc);
    }
}