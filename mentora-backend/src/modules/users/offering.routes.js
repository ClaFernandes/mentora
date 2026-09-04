const express = require("express");
const router = express.Router();
const { createOfferingController, updateOfferingController, deleteOfferingController } = require("./offering.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/", verifyToken, createOfferingController);
router.put("/:id", verifyToken, updateOfferingController);
router.delete("/:id", verifyToken, deleteOfferingController);

module.exports = router;