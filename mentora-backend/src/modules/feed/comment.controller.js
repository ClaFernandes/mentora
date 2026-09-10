const {
  likeComment,
  createComment,
  updateComment,
  deleteComment,
  reportComment,
  getComments,
} = require("./comment.service");

const likeCommentController = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const result = await likeComment(commentId, userId);
  res.status(200).json(result);
};

const createCommentController = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const text = req.body.text;
  const result = await createComment(postId, userId, text);
  res.status(201).json(result);
};

const updateCommentController = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const text = req.body.text;
  const result = await updateComment(commentId, userId, text);
  res.status(200).json(result);
};

const deleteCommentController = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const result = await deleteComment(commentId, userId);
  res.status(200).json(result);
};

const reportCommentController = async (req, res) => {
  const commentId = req.params.id;
  const result = await reportComment(commentId);
  res.status(200).json(result);
};

const getCommentsController = async (req, res) => {
  const postId = req.params.id;
  const result = await getComments(postId);
  res.status(200).json(result);
}

module.exports = {
  likeCommentController,
  createCommentController,
  updateCommentController,
  deleteCommentController,
  reportCommentController,
  getCommentsController,
};
