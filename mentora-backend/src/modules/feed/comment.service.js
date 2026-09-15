const Comment = require("./comment.model");
const Post = require("./post.model");
const MentorProfile = require("../users/mentor.model");
const { createNotification } = require("../notifications/notification.service");

const likeComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("Comentário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const liked = comment.likedBy.some(
    (id) => id.toString() === userId.toString(),
  );

  if (liked) {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { likedBy: userId } },
      { new: true },
    );

    return { likesCount: updatedComment.likedBy.length };
  } else {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $addToSet: { likedBy: userId } },
      { new: true },
    );

    const recipientId = comment.userId;
    await createNotification({
      type: "like",
      recipientId,
      actorId: userId,
      commentId,
    });

    return { likesCount: updatedComment.likedBy.length };
  }
};

const createComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const newComment = await Comment.create({
    postId,
    userId,
    text,
  });

  const mentor = await MentorProfile.findById(post.mentorId);
  const recipientId = mentor.userId;

  if (recipientId.toString() !== userId.toString()) {
    await createNotification({
      type: "comment",
      recipientId,
      actorId: userId,
      postId,
    });
  }

  return newComment;
};

const updateComment = async (commentId, userId, text) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("Comentário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (comment.userId.toString() !== userId.toString()) {
    const error = new Error("Não tens permissão para editar este comentário");
    error.statusCode = 403;
    throw error;
  }

  const updated = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { text } },
    { new: true },
  );

  return updated;
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("Comentário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (comment.userId.toString() !== userId.toString()) {
    const error = new Error("Não tens permissão para apagar este comentário");
    error.statusCode = 403;
    throw error;
  }

  const deleted = await Comment.findByIdAndDelete(commentId);

  return deleted;
};

const reportComment = async (commentId) => {
  const comment = await Comment.findByIdAndUpdate(commentId, {
    reported: true,
  });

  if (!comment) {
    const error = new Error("Comentário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return { reported: true };
};

const getComments = async (postId) => {
  const comments = await Comment.find({ postId })
    .sort({ createdAt: 1 })
    .populate("userId", "name surname email avatarUrl role");

  return comments;
}

module.exports = {
  likeComment,
  createComment,
  updateComment,
  deleteComment,
  reportComment,
  getComments,
};
