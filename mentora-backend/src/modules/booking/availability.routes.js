const express = require("express");
const router = express.Router();
const {
  getAvailabilityController,
  getAvailableSlotsController,
  createAvailabilityController,
  deleteAvailabilityController,
} = require("./availability.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/:id/availability", getAvailabilityController);
router.get("/:id/availability/:date/slots", getAvailableSlotsController);
router.post("/me/availability", verifyToken, createAvailabilityController);
router.delete(
  "/me/availability/:id",
  verifyToken,
  deleteAvailabilityController,
);

module.exports = router;
