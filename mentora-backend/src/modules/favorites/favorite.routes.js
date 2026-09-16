const express = require("express");
const router = express.Router({ mergeParams: true });
const { addFavoriteController, removeFavoriteController } = require("./favorite.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/", verifyToken, addFavoriteController);
router.delete("/", verifyToken, removeFavoriteController);

module.exports = router;