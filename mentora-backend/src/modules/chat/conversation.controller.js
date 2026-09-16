const {
    getConversations,
    sendMessage,
    getAllMessages,
    getMessagesBySender,
} = require("./conversation.service");

const getConversationsController = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await getConversations(userId, userRole);
    res.status(200).json(result);
};

const sendMessageController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { text, menteeId } = req.body;
    const result = await sendMessage(id, userId, userRole, { text, menteeId });
    res.status(201).json(result);
};

const getAllMessagesController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await getAllMessages(id, userId);
    res.status(200).json(result);
};

const getMessagesBySenderController = async (req, res) => {
    const { id, senderId } = req.params;
    const userId = req.user.id;
    const result = await getMessagesBySender(id, senderId, userId);
    res.status(200).json(result);
};

module.exports = {
    getConversationsController,
    sendMessageController,
    getAllMessagesController,
    getMessagesBySenderController,
};