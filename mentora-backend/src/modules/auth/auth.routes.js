const express = require("express");
const router = express.Router();
const { verifyToken } = require("./auth.middleware");
const { register, login, me, forgotPasswordHandler, resetPasswordHandler } = require("./auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

module.exports = router;
