import Product from "../models/product.js";
import cloudinary from "../../config/cloudinary/index.js";

class ProductController {
    get(req, res) {
        res.send("It okay!");
    }

    async post(req, res) {
        try {
            const {
                productName,
                productPrice,
                productDesc,
                previewSource,
                productNew,
            } = req.body;

            if(productName.trim()==='' || productDesc.trim()){
                res.send({ message: "Enter data, please" });
                return ;
            }

            const promises = await Promise.all(
                previewSource?.map((e) =>
                    cloudinary.uploader.upload(e, {
                        upload_preset: "ok-but-first-coffee",
                    })
                )
            );
            const productImage = [];
            for (const res of promises) productImage.push(res.public_id);

            await Product.create({
                name: productName,
                price: productPrice,
                productImage,
                description: productDesc,
                new: productNew,
            });

            res.send({ message: "Bạn đã upload thành công" });
        } catch (err) {
            res.status(500).json({ err: err });
        }
    }

    getId(req, res, next) {
        const _id = req.params.productId;
        Product.findOne(_id)
            .select("name price _id productImage")
            .exec()
            .then((doc) => {
                console.log("From database", doc);
                if (doc) {
                    res.status(200).json({
                        product: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products",
                        },
                    });
                } else {
                    res.status(404).json({
                        message: "No valid entry found for provided ID",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    }
}

export default new ProductController();
