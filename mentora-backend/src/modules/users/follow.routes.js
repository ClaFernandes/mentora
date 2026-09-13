const express = require("express");
const router = express.Router();
const {
  followMentorController,
  unfollowMentorController,
} = require("./follow.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/:id/follow", verifyToken, followMentorController);
router.delete("/:id/follow", verifyToken, unfollowMentorController);

module.exports = router;
