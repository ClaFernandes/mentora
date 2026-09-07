const express = require("express");
const router = express.Router();
const { createPostController, getFeedController } = require("./post.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/posts", verifyToken, createPostController);
router.get("/feed", verifyToken, getFeedController);

module.exports = router;

// POST /posts/:id/like
// POST /posts/:id/comments
// POST /posts/:id/report
