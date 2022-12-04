import Merch from "../models/merch.js";
import cloudinary from "../../config/cloudinary/index.js";

class MerchController {
    async getAll(req, res) {
        try {
            const data = await Merch.find({});
            res.json(data);
        } catch (error) {
            res.status(500).json({ err: error });
        }
    }

    async post(req, res) {
        try {
            const {
                merchName,
                merchPrice,
                newBadge,
                size,
                availability,
                color,
                brand,
                imageDisplay,
                merchImages,
                merchDesc,
                features,
            } = req.body;

            const cloudinaryUploader = (e) => {
                return cloudinary.uploader.upload(e, {
                    upload_preset: "ok-but-first-coffee",
                });
            };

            const merchImagesURL = await Promise.all(
                merchImages?.map((e) => cloudinaryUploader(e))
            );
            const merchImgs = [];
            for (const res of merchImagesURL) merchImgs.push(res.public_id);
            const imgDisplayCloudinary = await cloudinaryUploader(imageDisplay);

            const data = await Merch.create({
                name: merchName,
                price: merchPrice,
                imageDisplay: imgDisplayCloudinary.public_id,
                merchImages: merchImgs,
                newBadge,
                size,
                availability,
                color,
                brand,
                description: merchDesc,
                features,
            });

            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }

    async put(req, res) {
        try {
            const {
                merchName,
                merchPrice,
                newBadge,
                size,
                availability,
                color,
                brand,
                imageDisplay,
                merchImages,
                merchDesc,
                features,
            } = req.body;
            const _id = req.params.merchId;

            const prevProduct = await Merch.findOne({
                _id,
            });

            const deleteImage = async (e) => {
                cloudinary.uploader
                    .destroy(e, function (error, result) {
                        console.log(result, error);
                    })
                    .then((resp) => console.log(resp))
                    .catch((_err) =>
                        console.log(
                            "Something went wrong, please try again later."
                        )
                    );
            };
            if (imageDisplay.length > 30) deleteImage(prevProduct.imageDisplay);

            prevProduct.merchImages?.map((e) => {
                if (!merchImages.includes(e)) deleteImage(e);
            });

            const cloudinaryUploader = (e) => {
                return cloudinary.uploader.upload(e, {
                    upload_preset: "ok-but-first-coffee",
                });
            };
            const merchImgs = [];

            const merchImagesRes = await Promise.all(
                merchImages?.map((e) => {
                    if (e?.length > 30) {
                        return cloudinaryUploader(e);
                    } else {
                        merchImgs.push(e);
                        return false;
                    }
                })
            );
            for (const res of merchImagesRes)
                res ? merchImgs.push(res?.public_id) : "";

            let imgDisplayCloudinary = await (imageDisplay.length > 30
                ? cloudinaryUploader(imageDisplay)
                : imageDisplay);
            if (typeof imgDisplayCloudinary !== "string")
                imgDisplayCloudinary = imgDisplayCloudinary.public_id;
            await Merch.updateOne(
                { _id },
                {
                    name: merchName,
                    price: merchPrice,
                    imageDisplay: imgDisplayCloudinary,
                    merchImages: merchImgs,
                    newBadge,
                    size,
                    availability,
                    color,
                    brand,
                    description: merchDesc,
                    features,
                }
            );
            const product = await Merch.findOne({ _id });
            res.status(200).json(product);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async delete(req, res) {
        try {
            const _id = req.params.merchId;
            const prevMerch = await Merch.findOne({ _id });
            const deleteImage = async (e) => {
                cloudinary.uploader
                    .destroy(e, function (error, result) {
                        console.log(result, error);
                    })
                    .then((resp) => console.log(resp))
                    .catch((_err) =>
                        console.log(
                            "Something went wrong, please try again later."
                        )
                    );
            };

            deleteImage(prevMerch.imageDisplay);

            prevMerch.merchImages?.map((e) => {
                deleteImage(e);
            });

            await Merch.deleteOne({ _id });
            res.status(200).json({ _id, message: "Delete product success!!!" });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getId(req, res) {
        const _id = req.params.merchId;
        Merch.findById(_id)
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

export default new MerchController();
