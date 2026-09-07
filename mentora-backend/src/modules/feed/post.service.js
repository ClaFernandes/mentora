const Post = require('./post.model');
const MentorProfile = require('../users/mentor.model');

const createPost = async (userId, postData) => {
    const mentorProfile = await MentorProfile.findOne({ userId });
    if (!mentorProfile) {
        const error = new Error("Apenas mentores podem postar");
        error.statusCode = 403;
        throw error;
    };

    const newPost = await Post.create({ ...postData, mentorId: mentorProfile._id });
    return newPost;
}

const getFeed = async (cursor, limit) => {
    const filter = cursor ? { createdAt: { $lt: cursor } } : {};

    const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({
            path: "mentorId",
            populate: {
                path: "userId",
                select: "name email avatarUrl",
            },
        });

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : null;

    return { posts, nextCursor };
}

module.exports = { createPost, getFeed };