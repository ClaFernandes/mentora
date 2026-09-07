const { getNotification, markAsRead, markAllAsRead } = require("./notification.service");

const listNotifications = async (req, res) => {
    const userId = req.user.id;
    const result = await getNotification(userId);
    res.status(200).json(result);
}

const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await markAsRead(id, userId);
    res.status(200).json(result);
}

const markAllNotificationsAsRead = async (req, res) => {
    const userId = req.user.id;
    const result = await markAllAsRead(userId);
    res.status(200).json(result);
}

module.exports = { listNotifications, markNotificationAsRead, markAllNotificationsAsRead };

