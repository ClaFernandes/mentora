const Notification = require("./notification.model");

const createNotification = async ({ type, recipientId, actorId, postId }) => {
    if (recipientId.toString() === actorId.toString()) {
        return null;
    }

    const notification = await Notification.create({ type, recipientId, actorId, postId });
    return notification;
}

const getNotification = async (userId) => {
    const notifications = await Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .populate("actorId", "name avatarUrl");

    return notifications;
}

const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { $set: { read: true } },
        { new: true }
    );

    if (!notification) {
        const error = new Error("Notificação não encontrada");
        error.statusCode = 404;
        throw error;
    }
    return notification;
}

const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        { recipientId: userId, read: false },
        { $set: { read: true } }
    );
    return { message: "Todas as notificações foram marcadas como lidas" }
}

module.exports = { createNotification, getNotification, markAsRead, markAllAsRead };