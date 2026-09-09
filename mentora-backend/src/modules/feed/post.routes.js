const express = require("express");
const router = express.Router();
const {
  createPostController,
  getFeedController,
  likePostController,
  deletePostController,
  reportPostController,
  editPostController,
} = require("./post.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/posts", verifyToken, createPostController);
router.get("/feed", verifyToken, getFeedController);
router.post("/posts/:id/like", verifyToken, likePostController);
router.delete("/posts/:id", verifyToken, deletePostController);
router.post("/posts/:id/report", verifyToken, reportPostController);
router.put("/posts/:id", verifyToken, editPostController);

module.exports = router;
