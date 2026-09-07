const Post = require("./post.model");
const MentorProfile = require("../users/mentor.model");
const { createNotification } = require("../notifications/notification.service");

const createPost = async (userId, postData) => {
  const mentorProfile = await MentorProfile.findOne({ userId });
  if (!mentorProfile) {
    const error = new Error("Apenas mentores podem postar");
    error.statusCode = 403;
    throw error;
  }

  const newPost = await Post.create({
    ...postData,
    mentorId: mentorProfile._id,
  });
  return newPost;
};

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

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].createdAt : null;

  return { posts, nextCursor };
};

const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const liked = post.likedBy.some((id) => id.toString() === userId.toString());
  if (liked) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likedBy: userId } },
      { new: true },
    );
    return { likesCount: updatedPost.likedBy.length };
  } else {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likedBy: userId } },
      { new: true },
    );

    const mentor = await MentorProfile.findById(post.mentorId);
    const recipientId = mentor.userId;
    await createNotification({
      type: "like",
      recipientId,
      actorId: userId,
      postId,
    });
    return { likesCount: updatedPost.likedBy.length };
  }
};

module.exports = { createPost, getFeed, likePost };
