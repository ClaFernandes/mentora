const express = require("express");
const router = express.Router();
const { payController } = require("./payment.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/:id/pay", verifyToken, payController);

module.exports = router;
