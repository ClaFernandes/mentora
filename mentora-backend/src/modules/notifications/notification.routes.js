const express = require("express");
const router = express.Router();
const { listNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require("./notification.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/", verifyToken, listNotifications);
router.put("/:id/read", verifyToken, markNotificationAsRead);
router.put("/read-all", verifyToken, markAllNotificationsAsRead);

module.exports = router;