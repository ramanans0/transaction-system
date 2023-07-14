import {model, models, Schema} from "mongoose";

const CreditSchema = new Schema({
    title: {type: String, required: true},
    amount: {type: Number, required: true},
});

export const Credit = models.Credit || model('Credit', CreditSchema);