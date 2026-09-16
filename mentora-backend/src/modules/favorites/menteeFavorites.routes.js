const express = require("express");
const router = express.Router();
const { getFavoritesController } = require("./favorite.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/", verifyToken, getFavoritesController);

module.exports = router;