const express = require("express");
const router = express.Router();
const multer = require("multer");

const AuthController = require("../controllers/auth");

const upload = multer({ dest: "uploads/" });

/* GET home page. */
router.post("/login", AuthController.login);

router.post("/register", AuthController.register);

router.post("/logout", AuthController.logout);

router.get("/profile", AuthController.profile);

router.post("forgot-password", AuthController.forgotPassword);

module.exports = router;
