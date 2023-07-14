import {model, models, Schema} from "mongoose";

const RepaymentSchema = new Schema({
    amount: {type: Number, required: true},
    count: Number,
    type: String,
});

export const Repayment = models.Repayment || model('Repayment', RepaymentSchema);