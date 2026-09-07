const { createPost, getFeed } = require("./post.service");

const createPostController = async (req, res) => {
    const userId = req.user.id;
    const postData = req.body;
    const result = await createPost(userId, postData);
    res.status(201).json(result);
}

const getFeedController = async (req, res) => {
    const { cursor } = req.query;
    const limit = Number(req.query.limit) || 10;
    const result = await getFeed(cursor, limit);
    res.status(200).json(result);
}

module.exports = { createPostController, getFeedController };