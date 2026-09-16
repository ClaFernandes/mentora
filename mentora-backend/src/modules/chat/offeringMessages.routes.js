const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    sendMessageController,
    getAllMessagesController,
    getMessagesBySenderController,
} = require("./conversation.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.post("/", verifyToken, sendMessageController);
router.get("/", verifyToken, getAllMessagesController);
router.get("/:senderId", verifyToken, getMessagesBySenderController);

module.exports = router;