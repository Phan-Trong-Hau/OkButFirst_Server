import express from "express";

import ProductController from "../app/controllers/Product.js";

const router = express.Router();

// router sản phẩm
router.get("/products", ProductController.get);
router.post("/products", ProductController.post);
router.get("/products/:id", ProductController.getId);

export default router;
