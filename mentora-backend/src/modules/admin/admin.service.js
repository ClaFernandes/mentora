const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = require("../../config/mailer");
const User = require("../users/user.model");
const MentorProfile = require("../users/mentor.model");
const MenteeProfile = require("../users/mentee.model");
const Post = require("../feed/post.model");
const Comment = require("../feed/comment.model");
const Follow = require("../follow/follow.model");
const { Session } = require("../booking/booking.models");
const Payment = require("../payments/payment.model");
const { deleteUser } = require("../users/user.service");

function isSessionCompleted(session) {
  if (session.status === "completed") return true;
  if (session.status === "confirmed") {
    const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
    return sessionDateTime < new Date();
  }
  return false;
}

const getAllMentorsAdmin = async (status, page = 1, limit = 10) => {
  const filter = {};

  if (status === "pending") {
    filter.isVerified = false;
    filter.rejected = false;
  } else if (status === "approved") {
    filter.isVerified = true;
  } else if (status === "rejected") {
    filter.rejected = true;
  }

  const buildMentorObject = async (mentorProfile) => {
    const followersCount = await Follow.countDocuments({
      mentorId: mentorProfile._id,
    });
    return {
      id: mentorProfile.userId._id,
      name: mentorProfile.userId.name,
      surname: mentorProfile.userId.surname,
      avatarUrl: mentorProfile.userId.avatarUrl,
      status: mentorProfile.userId.status,
      bio: mentorProfile.bio,
      isVerified: mentorProfile.isVerified,
      rejected: mentorProfile.rejected,
      avgRating: mentorProfile.avgRating,
      followersCount,
    };
  };

  if (status === "pending") {
    const mentorProfiles = await MentorProfile.find(filter)
      .limit(200)
      .populate("userId", "name surname avatarUrl status");

    const mentors = await Promise.all(mentorProfiles.map(buildMentorObject));
    return { mentors, total: mentors.length, page: 1, totalPages: 1 };
  }

  const total = await MentorProfile.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const skip = (page - 1) * limit;

  const mentorProfiles = await MentorProfile.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name surname avatarUrl status");

  const mentors = await Promise.all(mentorProfiles.map(buildMentorObject));

  return { mentors, total, page, totalPages };
};

const getAllMenteesAdmin = async (page = 1, limit = 10) => {
  const total = await MenteeProfile.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const skip = (page - 1) * limit;

  const menteeProfiles = await MenteeProfile.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name surname avatarUrl status");

  const mentees = await Promise.all(
    menteeProfiles.map(async (profile) => {
      const candidateSessions = await Session.find({
        menteeId: profile.userId._id,
        status: { $in: ["completed", "confirmed"] },
      });
      const completedSessions =
        candidateSessions.filter(isSessionCompleted).length;

      return {
        id: profile.userId._id,
        name: profile.userId.name,
        surname: profile.userId.surname,
        avatarUrl: profile.userId.avatarUrl,
        status: profile.userId.status,
        completedSessions,
      };
    }),
  );

  return { mentees, total, page, totalPages };
};

const approveMentor = async (mentorUserId) => {
  const mentorProfile = await MentorProfile.findOneAndUpdate(
    { userId: mentorUserId },
    { $set: { isVerified: true, rejected: false } },
    { new: true },
  );

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return mentorProfile;
};

const rejectMentor = async (mentorUserId) => {
  const mentorProfile = await MentorProfile.findOneAndUpdate(
    { userId: mentorUserId },
    { $set: { rejected: true } },
    { new: true },
  );

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return mentorProfile;
};

const getReportedContent = async (page = 1, limit = 10) => {
  const reportedPosts = await Post.find({ reported: true }).select("content");
  const reportedComments = await Comment.find({ reported: true }).select(
    "text",
  );

  const combined = [
    ...reportedPosts.map((p) => ({ kind: "post", item: p })),
    ...reportedComments.map((c) => ({ kind: "comment", item: c })),
  ];

  const total = combined.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const skip = (page - 1) * limit;
  const pageItems = combined.slice(skip, skip + limit);

  const pagedPosts = pageItems
    .filter((entry) => entry.kind === "post")
    .map((entry) => entry.item);
  const pagedComments = pageItems
    .filter((entry) => entry.kind === "comment")
    .map((entry) => entry.item);

  return {
    reportedPosts: pagedPosts,
    reportedComments: pagedComments,
    total,
    page,
    totalPages,
  };
};

const dismissPostReport = async (postId) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $set: { reported: false } },
    { new: true },
  );
  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return post;
};

const removeReportedPost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) {
    const error = new Error("Post não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Post removido com sucesso" };
};

const dismissCommentReport = async (commentId) => {
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { reported: false } },
    { new: true },
  );
  if (!comment) {
    const error = new Error("Comentário não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return comment;
};

const removeReportedComment = async (commentId) => {
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    const error = new Error("Comentário não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Comentário removido com sucesso" };
};

const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Utilizador não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "admin") {
    const error = new Error("Usa a gestão de administradores para esta conta");
    error.statusCode = 400;
    throw error;
  }

  const newStatus = user.status === "active" ? "suspended" : "active";

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { status: newStatus } },
    { new: true, runValidators: true },
  );

  return { id: updatedUser._id, status: updatedUser.status };
};

const deleteMentorAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "mentor") {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return deleteUser(userId);
};

const deleteMenteeAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "mentee") {
    const error = new Error("Mentorado não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return deleteUser(userId);
};

const getAllAdmins = async () => {
  const admins = await User.find({ role: "admin" }).select(
    "name surname email status createdAt",
  );
  return admins;
};

const createAdmin = async ({ name, surname, birthDate, email }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Já existe uma conta com este email");
    error.statusCode = 400;
    throw error;
  }

  const placeholderPassword = crypto.randomBytes(32).toString("hex");
  const passwordHash = await bcrypt.hash(placeholderPassword, 12);

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = Date.now() + 15 * 60 * 1000;

  const newAdmin = await User.create({
    name,
    surname,
    birthDate,
    email,
    passwordHash,
    role: "admin",
    status: "active",
    resetPasswordToken: resetToken,
    resetPasswordExpires: resetTokenExpires,
  });

  const setupLink = `${process.env.FRONTEND_URL}/mentora/update-password?token=${resetToken}`;

  await transporter.sendMail({
    from: '"Mentora" <no-reply@mentora.com>',
    to: newAdmin.email,
    subject: "Bem-vindo(a) ao painel de administração — Mentora",
    html: `
            <p>Olá ${newAdmin.name},</p>
            <p>Foi criada uma conta de administrador para ti na plataforma Mentora.</p>
            <p>Clica no link abaixo para definires a tua palavra-passe e ativares o acesso:</p>
            <a href="${setupLink}" target="_blank">Definir palavra-passe</a>
            <p>Este link expira em 15 minutos.</p>
        `,
  });

  return {
    id: newAdmin._id,
    name: newAdmin.name,
    surname: newAdmin.surname,
    email: newAdmin.email,
    status: newAdmin.status,
  };
};

const removeAdmin = async (adminId, requestingAdminId) => {
  if (adminId.toString() === requestingAdminId.toString()) {
    const error = new Error(
      "Não podes remover a tua própria conta de administrador",
    );
    error.statusCode = 400;
    throw error;
  }

  const admin = await User.findOneAndDelete({ _id: adminId, role: "admin" });

  if (!admin) {
    const error = new Error("Administrador não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Administrador removido com sucesso" };
};

const getStats = async () => {
  const totalMentors = await MentorProfile.countDocuments();
  const totalMentees = await MenteeProfile.countDocuments();

  const candidateSessions = await Session.find({
    status: { $in: ["completed", "confirmed"] },
  });
  const completedSessionsList = candidateSessions.filter(isSessionCompleted);
  const completedSessions = completedSessionsList.length;

  const completedSessionIds = completedSessionsList.map((s) => s._id);
  const payments = await Payment.find({
    sessionId: { $in: completedSessionIds },
    status: "paid",
  });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const pendingMentorsCount = await MentorProfile.countDocuments({
    isVerified: false,
    rejected: false,
  });

  const reportedPostsCount = await Post.countDocuments({ reported: true });
  const reportedCommentsCount = await Comment.countDocuments({
    reported: true,
  });
  const reportedContentCount = reportedPostsCount + reportedCommentsCount;

  const suspendedAccountsCount = await User.countDocuments({
    role: { $in: ["mentor", "mentee"] },
    status: "suspended",
  });

  const topMentorProfiles = await MentorProfile.find()
    .sort({ avgRating: -1 })
    .limit(3)
    .populate("userId", "name surname avatarUrl");

  const topRatedMentors = topMentorProfiles.map((m) => ({
    id: m.userId._id,
    name: m.userId.name,
    surname: m.userId.surname,
    avatarUrl: m.userId.avatarUrl,
    avgRating: m.avgRating,
  }));

  const MONTH_NAMES = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const paymentsBySession = {};
  for (const payment of payments) {
    paymentsBySession[payment.sessionId.toString()] = payment.amount;
  }

  const monthlyData = {};
  for (const session of completedSessionsList) {
    const sessionDate = new Date(`${session.date}T00:00:00`);
    const monthLabel = MONTH_NAMES[sessionDate.getMonth()];

    if (!monthlyData[monthLabel]) {
      monthlyData[monthLabel] = { mes: monthLabel, sessoes: 0, receita: 0 };
    }

    monthlyData[monthLabel].sessoes += 1;
    monthlyData[monthLabel].receita +=
      paymentsBySession[session._id.toString()] || 0;
  }

  const chartData = Object.values(monthlyData);

  return {
    totalMentors,
    totalMentees,
    completedSessions,
    totalRevenue,
    pendingMentorsCount,
    reportedContentCount,
    suspendedAccountsCount,
    topRatedMentors,
    chartData,
  };
};

module.exports = {
  getAllMentorsAdmin,
  getAllMenteesAdmin,
  approveMentor,
  rejectMentor,
  getReportedContent,
  dismissPostReport,
  removeReportedPost,
  dismissCommentReport,
  removeReportedComment,
  toggleUserStatus,
  deleteMentorAccount,
  deleteMenteeAccount,
  getAllAdmins,
  createAdmin,
  removeAdmin,
  getStats,
};
