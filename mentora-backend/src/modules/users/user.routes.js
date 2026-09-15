const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/auth.middleware");
const { deleteMeController, updateAvatarController } = require("./user.controller");

router.delete("/me", verifyToken, deleteMeController);
router.put("/me/avatar", verifyToken, updateAvatarController);

module.exports = router;