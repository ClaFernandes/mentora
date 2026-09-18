const express = require("express");
const router = express.Router();
const {
  createSessionController,
  getSessionsController,
  cancelSessionController,
  rateSessionController,
} = require("./session.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/", verifyToken, createSessionController);
router.get("/", verifyToken, getSessionsController);
router.put("/:id/cancel", verifyToken, cancelSessionController);
router.put("/:id/rate", verifyToken, rateSessionController);

module.exports = router;
