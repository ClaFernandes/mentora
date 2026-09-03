const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/auth.middleware");
const { deleteMe } = require("./user.controller");

router.delete("/me", verifyToken, deleteMe);

module.exports = router;