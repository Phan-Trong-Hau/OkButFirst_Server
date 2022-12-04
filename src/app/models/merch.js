import mongoose from "mongoose";
const Schema = mongoose.Schema;

const merch = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageDisplay: { type: String, required: true },
        merchImages: { type: Array, required: true },
        size: { type: Array, required: true },
        brand: { type: String, required: true },
        availability: { type: String, required: true },
        /* 
            ["","","", ...]
        */
        newBadge: { type: Boolean, required: true },
        /*
            [
                {
                    img: 
                    desc:
                }
            ]
        */
        color: { type: Array, required: true },
        description: { type: String, required: true },
        features: { type: String, required: true },
        review: Array,
        /*
            [
                {
                    name:
                    email:
                    rating:
                    title:
                    body:
                    customerImage:
                    reviewImage:
                    content:
                    rate:

                }
            ]
         */
        question: Array,
        /*
            [
                {
                    name:
                    email:
                    question:
                }
            ]
         */
    },
    {
        timestamps: true,
    }
);

const Models = mongoose.model("merches", merch);

export default Models;
