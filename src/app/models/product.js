import mongoose from "mongoose";
const Schema = mongoose.Schema;

const product = new Schema(
    {
        name: { type: String, required: true },
        imageDisplay: { type: String, required: true },
        imageBackground: {type: String, required: true},
        productImages: { type: Array, required: true },
        bagSize: { type: Array, required: true },
        grind: { type: Array, required: true },
        /* 
            ["","","", ...]
        */
        price: { type: Number, required: true },
        newBadge: { type: Boolean, required: true },
        making: { type: Array, required: true },
        /*
            [
                {
                    img: 
                    desc:
                }
            ]
        */
        color: { type: Object, blackbox: true },
        imageExtra: {type: Object, blackbox: true },

        discription: { type: Array, required: true },
        /*
            ["desc1","desc2"]
        */
        description: { type: String, required: true },
        imageMiddleRoast: {type: String, required: true},
        
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

const Models = mongoose.model("products", product);

export default Models;
