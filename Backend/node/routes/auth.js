const express = require("express");
const router = express.Router();
const multer = require("multer");

const AuthController = require("../controllers/auth");
const wrapAsync = require("../utils/wrapAsync");

const upload = multer({ dest: "uploads/" });

/* GET home page. */
router.post("/login", wrapAsync(AuthController.login));

router.post("/register", wrapAsync(AuthController.register));

router.post("/logout", wrapAsync(AuthController.logout));

router.get("/profile", wrapAsync(AuthController.profile));

router.post("forgot-password", wrapAsync(AuthController.forgotPassword));

module.exports = router;
