const express = require("express");
const router = express.Router();
const {
  createPostController,
  getFeedController,
  likePostController,
  deletePostController,
} = require("./post.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/posts", verifyToken, createPostController);
router.get("/feed", verifyToken, getFeedController);
router.post("/posts/:id/like", verifyToken, likePostController);
router.delete("/posts/:id", verifyToken, deletePostController);

module.exports = router;