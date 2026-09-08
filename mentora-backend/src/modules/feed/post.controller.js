const { createPost, getFeed, likePost, deletePost } = require("./post.service");

const createPostController = async (req, res) => {
  const userId = req.user.id;
  const postData = req.body;
  const result = await createPost(userId, postData);
  res.status(201).json(result);
};

const getFeedController = async (req, res) => {
  const { cursor } = req.query;
  const limit = Number(req.query.limit) || 10;
  const result = await getFeed(cursor, limit);
  res.status(200).json(result);
};

const likePostController = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const result = await likePost(postId, userId);
  res.status(200).json(result);
};

const deletePostController = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const result = await deletePost(postId, userId);
  res.status(200).json(result);
}

module.exports = {
  createPostController,
  getFeedController,
  likePostController,
  deletePostController,
};
