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
                imageMiddleRoast,
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

            const images = await Promise.all([
                cloudinaryUploader(imgExtra.imgBag),
                cloudinaryUploader(imgExtra.imgSub),
                cloudinaryUploader(imageDisplay),
                cloudinaryUploader(imgBackground),
                cloudinaryUploader(imageMiddleRoast),
            ]);

            const data = await Product.create({
                name: productName,
                price: productPrice,
                productImages: productImgs,
                imageDisplay: images[2].public_id,
                imageBackground: images[3].public_id,
                bagSize,
                grind,
                newBadge,
                making,
                color,
                imageExtra: {
                    imgBag: images[0].public_id,
                    imgSub: images[1].public_id,
                },
                discription,
                description: productDesc,
                imageMiddleRoast: images[4].public_id,
            });

            res.json(data);
        } catch (err) {
            res.status(500).json({ err: err });
        }
    }

    async put(req, res) {
        const _id = req.body.productId;
        const product = await Product.updateOne(_id);
        console.log(product);
        res.json(123);
    }

    async delete(req, res) {
        res.json(123);
    }

    getId(req, res) {
        const _id = req.params.id;
        Product.findOne({ _id })
            .then((doc) => {
                if (doc) {
                    res.status(200).json({
                        product: doc,
                    });
                } else {
                    res.status(404).json({
                        message: "No valid entry found for provided ID",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }
}

export default new ProductController();
