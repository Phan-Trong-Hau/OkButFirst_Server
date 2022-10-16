import mongoose from "mongoose";
const Schema = mongoose.Schema;

const product = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        productImage: { type: Array, required: true },
        description: { type: String, required: true },
        new: Boolean,
    },
    {
        timestamps: true,
    }
);

const Models = mongoose.model("products", product);

export default Models;
