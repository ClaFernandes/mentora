const {
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
} = require("./admin.service");

const getAllMentorsController = async (req, res) => {
  const { status } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await getAllMentorsAdmin(status, page, limit);
  res.status(200).json(result);
};

const getAllMenteesController = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await getAllMenteesAdmin(page, limit);
  res.status(200).json(result);
};

const approveMentorController = async (req, res) => {
  const { id } = req.params;
  const result = await approveMentor(id);
  res.status(200).json(result);
};

const rejectMentorController = async (req, res) => {
  const { id } = req.params;
  const result = await rejectMentor(id);
  res.status(200).json(result);
};

const getReportedContentController = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await getReportedContent(page, limit);
  res.status(200).json(result);
};

const dismissPostReportController = async (req, res) => {
  const { id } = req.params;
  const result = await dismissPostReport(id);
  res.status(200).json(result);
};

const removeReportedPostController = async (req, res) => {
  const { id } = req.params;
  const result = await removeReportedPost(id);
  res.status(200).json(result);
};

const dismissCommentReportController = async (req, res) => {
  const { id } = req.params;
  const result = await dismissCommentReport(id);
  res.status(200).json(result);
};

const removeReportedCommentController = async (req, res) => {
  const { id } = req.params;
  const result = await removeReportedComment(id);
  res.status(200).json(result);
};

const toggleUserStatusController = async (req, res) => {
  const { id } = req.params;
  const result = await toggleUserStatus(id);
  res.status(200).json(result);
};

const deleteMentorAccountController = async (req, res) => {
  const { id } = req.params;
  const result = await deleteMentorAccount(id);
  res.status(200).json(result);
};

const deleteMenteeAccountController = async (req, res) => {
  const { id } = req.params;
  const result = await deleteMenteeAccount(id);
  res.status(200).json(result);
};

const getAllAdminsController = async (req, res) => {
  const result = await getAllAdmins(req.user.id);
  res.status(200).json(result);
};

const createAdminController = async (req, res) => {
  const { name, surname, birthDate, email, password, confirmPassword } = req.body;
  const result = await createAdmin({ name, surname, birthDate, email, password, confirmPassword });
  res.status(201).json(result);
};

const removeAdminController = async (req, res) => {
  const { id } = req.params;
  const requestingAdminId = req.user.id;
  const result = await removeAdmin(id, requestingAdminId);
  res.status(200).json(result);
};

const getStatsController = async (req, res) => {
  const result = await getStats();
  res.status(200).json(result);
};

module.exports = {
  getAllMentorsController,
  getAllMenteesController,
  approveMentorController,
  rejectMentorController,
  getReportedContentController,
  dismissPostReportController,
  removeReportedPostController,
  dismissCommentReportController,
  removeReportedCommentController,
  toggleUserStatusController,
  deleteMentorAccountController,
  deleteMenteeAccountController,
  getAllAdminsController,
  createAdminController,
  removeAdminController,
  getStatsController,
};