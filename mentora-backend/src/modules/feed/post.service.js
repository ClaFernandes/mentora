const Post = require("./post.model");
const Comment = require("./comment.model");
const MentorProfile = require("../users/mentor.model");
const { createNotification } = require("../notifications/notification.service");

async function attachCommentsCount(post) {
  const commentsCount = await Comment.countDocuments({ postId: post._id });
  return { ...post.toObject(), commentsCount };
}

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

  await newPost.populate({
    path: "mentorId",
    populate: {
      path: "userId",
      select: "name surname email avatarUrl",
    },
  });

  return { ...newPost.toObject(), commentsCount: 0 };
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
        select: "name surname email avatarUrl",
      },
    });

  const postsWithCounts = await Promise.all(posts.map(attachCommentsCount));

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].createdAt : null;

  return { posts: postsWithCounts, nextCursor };
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate({
    path: "mentorId",
    populate: {
      path: "userId",
      select: "name surname email avatarUrl",
    },
  });

  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return attachCommentsCount(post);
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

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const mentor = await MentorProfile.findById(post.mentorId);
  const ownerId = mentor.userId;

  if (ownerId.toString() !== userId.toString()) {
    const error = new Error("Não tens permissão para apagar este post");
    error.statusCode = 403;
    throw error;
  }

  const deleted = await Post.findByIdAndDelete(postId);

  return deleted;
};

const reportPost = async (postId) => {
  const post = await Post.findByIdAndUpdate(postId, { reported: true });

  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return { reported: true };
};

const editPost = async (postId, userId, updates) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const mentorProfile = await MentorProfile.findById(post.mentorId);

  if (mentorProfile.userId.toString() !== userId.toString()) {
    const error = new Error("Não tens permissão para editar este post");
    error.statusCode = 403;
    throw error;
  }

  const fieldsToUpdate = {
    content: updates.content,
    edited: true,
  };

  if (updates.imageUrl === null) {
    fieldsToUpdate.imageUrl = "";
    fieldsToUpdate.type = "text";
  } else if (updates.imageUrl !== undefined) {
    fieldsToUpdate.imageUrl = updates.imageUrl;
    fieldsToUpdate.type = "image";
  }

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $set: fieldsToUpdate },
    { new: true },
  ).populate({
    path: "mentorId",
    populate: {
      path: "userId",
      select: "name surname email avatarUrl",
    },
  });

  return attachCommentsCount(updated);
};

module.exports = {
  createPost,
  getFeed,
  getPostById,
  likePost,
  deletePost,
  reportPost,
  editPost,
};
