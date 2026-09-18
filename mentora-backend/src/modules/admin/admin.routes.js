const express = require("express");
const router = express.Router();
const {
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
} = require("./admin.controller");
const { verifyToken, requireAdmin } = require("../auth/auth.middleware");

router.use(verifyToken, requireAdmin);

router.get("/mentors", getAllMentorsController);
router.get("/mentees", getAllMenteesController);
router.put("/mentors/:id/approve", approveMentorController);
router.put("/mentors/:id/reject", rejectMentorController);

router.get("/reported-content", getReportedContentController);
router.put("/posts/:id/dismiss", dismissPostReportController);
router.delete("/posts/:id", removeReportedPostController);
router.put("/comments/:id/dismiss", dismissCommentReportController);
router.delete("/comments/:id", removeReportedCommentController);

router.put("/users/:id/status", toggleUserStatusController);
router.delete("/mentors/:id", deleteMentorAccountController);
router.delete("/mentees/:id", deleteMenteeAccountController);

router.get("/admins", getAllAdminsController);
router.post("/admins", createAdminController);
router.delete("/admins/:id", removeAdminController);

router.get("/stats", getStatsController);

module.exports = router;