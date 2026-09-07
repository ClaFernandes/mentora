const express = require("express");
const router = express.Router();
const {
  createPostController,
  getFeedController,
  likePostController,
} = require("./post.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/posts", verifyToken, createPostController);
router.get("/feed", verifyToken, getFeedController);
router.post("/posts/:id/like", verifyToken, likePostController);

module.exports = router;

// POST /posts/:id/comments
// POST /posts/:id/report
