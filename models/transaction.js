import {model, models, Schema} from "mongoose";

const TransactionSchema = new Schema({
    title: {type: String, required: true},
    amount: {type: Number, required: true},

    type: String,
    status: String,
});

export const Transaction = models.Transaction || model('Transaction', TransactionSchema);
