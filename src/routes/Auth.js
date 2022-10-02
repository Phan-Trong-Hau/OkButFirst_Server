import express from "express";

import LoginController from "../app/controllers/Login.js";
import SignupController from "../app/controllers/Signup.js";
import VerifyController from "../app/controllers/Verify.js";

const router = express.Router();

// router đăng nhập
router.get("/login", LoginController.get);
router.post("/login", LoginController.post);

// router đăng ký tài khoản
router.get("/signup", SignupController.get);
router.post("/signup", SignupController.post);

// router xác thực tài khoản
router.get("/user/verify/:userId/:uniqueString", VerifyController.getSlug);
router.get("/user/verify", VerifyController.get);
router.post("/user/verify", VerifyController.post);

export default router;
