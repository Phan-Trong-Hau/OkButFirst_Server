import express from "express";
import ProductController from "../app/controllers/Product.js";
import MerchController from "../app/controllers/Merch.js";
import AccountController from "../app/controllers/Account.js";
import { restrictToAdmins } from "../app/controllers/Authentication.js";
const router = express.Router();

// router products coffee
router.get("/products", ProductController.getAll);
router.post("/products", restrictToAdmins, ProductController.post);
router.get("/products/:productId", ProductController.getId);
router.put("/products/:productId", restrictToAdmins, ProductController.put);
router.delete(
  "/products/:productId",
  restrictToAdmins,
  ProductController.delete
);

// router merch shop
router.get("/merch", MerchController.getAll);
router.post("/merch", restrictToAdmins, MerchController.post);
router.get("/merch/:merchId", MerchController.getId);
router.put("/merch/:merchId", restrictToAdmins, MerchController.put);
router.delete("/merch/:merchId", restrictToAdmins, MerchController.delete);

// router users
router.get("/accounts", AccountController.getAll);
router.post("/accounts/:email", AccountController.post);

export default router;
