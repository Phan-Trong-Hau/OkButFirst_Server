import mongoose from "mongoose";
const Schema = mongoose.Schema;

const account = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        verified: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

const Models = mongoose.model("accounts", account);

export default Models;
