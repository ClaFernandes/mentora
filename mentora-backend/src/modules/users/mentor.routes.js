const express = require("express");
const router = express.Router();
const { getMentorController, updateMentorController, searchMentorsController } = require("./mentor.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/", searchMentorsController);
router.get("/:id", getMentorController);
router.put("/me", verifyToken, updateMentorController);

module.exports = router;