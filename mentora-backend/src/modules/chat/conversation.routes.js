const express = require("express");
const router = express.Router();
const { getConversationsController, markConversationAsReadController } = require("./conversation.controller");
const { verifyToken } = require("../auth/auth.middleware");

router.get("/", verifyToken, getConversationsController);
router.put("/:id/read", verifyToken, markConversationAsReadController);

module.exports = router;