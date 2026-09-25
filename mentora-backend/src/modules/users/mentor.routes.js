const express = require("express");
const router = express.Router();
const { getMentorController, updateMentorController, searchMentorsController, getMyFollowersController, removeFollowerController } = require("./mentor.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/", searchMentorsController);
router.get("/me/followers", verifyToken, getMyFollowersController);
router.get("/:id", getMentorController);
router.put("/me", verifyToken, updateMentorController);
router.delete("/me/followers/:followerId", verifyToken, removeFollowerController);

module.exports = router;