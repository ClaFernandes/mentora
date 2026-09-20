const {
  createPost,
  getFeed,
  getPostById,
  likePost,
  deletePost,
  reportPost,
  editPost,
  getPostsByMentor,
} = require("./post.service");

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

const getPostByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await getPostById(id);
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
};

const reportPostController = async (req, res) => {
  const postId = req.params.id;
  const result = await reportPost(postId);
  res.status(200).json(result);
};

const editPostController = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const updates = req.body;
  const result = await editPost(postId, userId, updates);
  res.status(200).json(result);
};

const getPostsByMentorController = async (req, res) => {
  const { id } = req.params;
  const { cursor } = req.query;
  const limit = Number(req.query.limit) || 3;
  const result = await getPostsByMentor(id, cursor, limit);
  res.status(200).json(result);
};

module.exports = {
  createPostController,
  getFeedController,
  getPostByIdController,
  likePostController,
  deletePostController,
  reportPostController,
  editPostController,
  getPostsByMentorController,
};
