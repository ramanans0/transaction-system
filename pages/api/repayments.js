import { mongooseConnect } from "../../lib/mongoose";
import { Repayment } from "../../models/Repayment";


export default async function handle(req, res) {

    const { method } = req;
    await mongooseConnect();

    if (method === "GET") {
        // finds inidividual entry if id is provided
        if (req.query?.repaymentId) {
            res.json(await Repayment.findOne({title:req.query.repaymentId}));
        }
        else {
            res.json(await Repayment.find());
        }
    }
    // creates new entry
    if (method === "POST") {
        const {type, amount, count} = req.body;
        const repaymentDoc = await Repayment.create({
            type, amount, count,
        })
        res.json(repaymentDoc);
    }
}