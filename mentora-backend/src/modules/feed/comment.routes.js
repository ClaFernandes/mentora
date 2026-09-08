const express = require("express");
const router = express.Router();
const {
  likeCommentController,
  createCommentController,
  updateCommentController,
  deleteCommentController,
  reportCommentController,
} = require("./comment.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/comments/:id/like", verifyToken, likeCommentController);
router.post("/posts/:id/comments", verifyToken, createCommentController);
router.put("/comments/:id", verifyToken, updateCommentController);
router.delete("/comments/:id", verifyToken, deleteCommentController);
router.post("/comments/:id/report", verifyToken, reportCommentController);

module.exports = router;
