import mongoose from "mongoose";
const Schema = mongoose.Schema;

const verification = new Schema(
    {
        userId: String,
        uniqueString: String,
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

const Models = mongoose.model("verifications", verification);

export default Models;
