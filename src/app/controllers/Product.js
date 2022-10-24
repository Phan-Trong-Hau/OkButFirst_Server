import Product from "../models/product.js";
import cloudinary from "../../config/cloudinary/index.js";

class ProductController {
    async get(req, res) {
        try {
            const data = await Product.find({});
            res.json(data);
        } catch (error) {
            res.status(500).json({ err: error });
        }
    }

    async post(req, res) {
        try {
            const {
                productName,
                productPrice,
                productDesc,
                discription,
                imageDisplay,
                imgBackground,
                productImages,
                newBadge,
                bagSize,
                grind,
                making,
                imgExtra,
                color,
            } = req.body;

            const cloudinaryUploader = (e) => {
                return cloudinary.uploader.upload(e, {
                    upload_preset: "ok-but-first-coffee",
                });
            };

            const productImagesURL = await Promise.all(
                productImages?.map((e) => cloudinaryUploader(e))
            );
            const productImgs = [];
            for (const res of productImagesURL) productImgs.push(res.public_id);

            const makingImg = await Promise.all(
                making?.map((e) => cloudinaryUploader(e.img))
            );

            for (let i = 0; i < making.length; i++) {
                making[i].img = makingImg[i].public_id;
            }

            const promises = await Promise.all([
                cloudinaryUploader(imgExtra.imgBag),
                cloudinaryUploader(imgExtra.imgSub),
                cloudinaryUploader(imageDisplay),
                cloudinaryUploader(imgBackground),
            ]);

            await Product.create({
                name: productName,
                price: productPrice,
                productImages: productImgs,
                imageDisplay: promises[2].public_id,
                imageBackground: promises[3].public_id,
                bagSize,
                grind,
                newBadge,
                making,
                color,
                imageExtra: {
                    imgBag: promises[0].public_id,
                    imgSub: promises[1].public_id,
                },
                discription,
                description: productDesc,
            });
            res.send({ message: "Create product success!" });
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
