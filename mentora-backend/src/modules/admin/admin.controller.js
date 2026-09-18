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
    const result = await getAllMentorsAdmin();
    res.status(200).json(result);
};

const getAllMenteesController = async (req, res) => {
    const result = await getAllMenteesAdmin();
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
    const result = await getReportedContent();
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
    const result = await getAllAdmins();
    res.status(200).json(result);
};

const createAdminController = async (req, res) => {
    const { name, surname, birthDate, email } = req.body;
    const result = await createAdmin({ name, surname, birthDate, email });
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