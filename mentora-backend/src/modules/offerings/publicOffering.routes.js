const express = require("express");
const router = express.Router();
const {
  getAllOfferingsController,
  getOfferingByIdController,
} = require("./offering.controller");

router.get("/", getAllOfferingsController);
router.get("/:id", getOfferingByIdController);

module.exports = router;
