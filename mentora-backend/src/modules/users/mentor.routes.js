const express = require("express");
const router = express.Router();
const { getMentorController, updateMentorController, searchMentorsController, verifyMentorController } = require("./mentor.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/", searchMentorsController);
router.get("/:id", getMentorController);
router.put("/me", verifyToken, updateMentorController);
router.put("/:id/verify", verifyMentorController);

module.exports = router;