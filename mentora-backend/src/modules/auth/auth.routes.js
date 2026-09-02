const express = require("express");
const router = express.Router();
const { verifyToken } = require("./auth.middleware");
const { register, login, me } = require("./auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);

module.exports = router;
