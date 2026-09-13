const express = require("express");
const router = express.Router();
const {
  createSessionController,
  getSessionsController,
  cancelSessionController,
} = require("./session.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/", verifyToken, createSessionController);
router.get("/", verifyToken, getSessionsController);
router.put("/:id/cancel", verifyToken, cancelSessionController);

module.exports = router;
