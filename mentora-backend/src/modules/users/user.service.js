const User = require("./user.model");
const MentorProfile = require("./mentor.model");
const MenteeProfile = require("./mentee.model");
const Offering = require("../offerings/offering.model");
const { Availability, Session } = require("../booking/booking.models");
const Post = require("../feed/post.model");
const Comment = require("../feed/comment.model");
const Payment = require("../payments/payment.model");
const Conversation = require("../chat/conversation.model");
const Message = require("../chat/message.model");
const Favorite = require("../favorites/favorite.model");
const Follow = require("../follow/follow.model");
const Notification = require("../notifications/notification.model");

const deleteUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("Utilizador não encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "mentor") {
        const mentorProfile = await MentorProfile.findOne({ userId: user._id });

        if (mentorProfile) {
            const offerings = await Offering.find({ mentorId: mentorProfile._id });
            const offeringIds = offerings.map((o) => o._id);

            const posts = await Post.find({ mentorId: mentorProfile._id });
            const postIds = posts.map((p) => p._id);
            await Comment.deleteMany({ postId: { $in: postIds } });
            await Comment.deleteMany({ userId: user._id });
            await Post.deleteMany({ mentorId: mentorProfile._id });

            const sessions = await Session.find({ mentorId: mentorProfile._id });
            const sessionIds = sessions.map((s) => s._id);
            await Payment.deleteMany({ sessionId: { $in: sessionIds } });

            const conversations = await Conversation.find({ offeringId: { $in: offeringIds } });
            const conversationIds = conversations.map((c) => c._id);
            await Message.deleteMany({ conversationId: { $in: conversationIds } });
            await Conversation.deleteMany({ offeringId: { $in: offeringIds } });

            await Favorite.deleteMany({ offeringId: { $in: offeringIds } });

            await Session.deleteMany({ mentorId: mentorProfile._id });
            await Offering.deleteMany({ mentorId: mentorProfile._id });
            await Availability.deleteMany({ mentorId: mentorProfile._id });
            await Follow.deleteMany({ mentorId: mentorProfile._id });

            await Notification.deleteMany({
                $or: [{ actorId: user._id }, { recipientId: user._id }],
            });

            await MentorProfile.deleteOne({ _id: mentorProfile._id });
        }
    }

    if (user.role === "mentee") {
        const sessions = await Session.find({ menteeId: user._id });
        const sessionIds = sessions.map((s) => s._id);
        await Payment.deleteMany({ sessionId: { $in: sessionIds } });

        const conversations = await Conversation.find({ menteeId: user._id });
        const conversationIds = conversations.map((c) => c._id);
        await Message.deleteMany({ conversationId: { $in: conversationIds } });
        await Conversation.deleteMany({ menteeId: user._id });

        await Comment.deleteMany({ userId: user._id });
        await Favorite.deleteMany({ menteeId: user._id });
        await Session.deleteMany({ menteeId: user._id });
        await Follow.deleteMany({ followerId: user._id });

        await Notification.deleteMany({
            $or: [{ actorId: user._id }, { recipientId: user._id }],
        });

        await MenteeProfile.deleteOne({ userId: user._id });
    }

    await User.deleteOne({ _id: user._id });

    return { message: "Conta apagada com sucesso" };
}

const updateAvatar = async (userId, avatarUrl) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { avatarUrl } },
        { new: true, runValidators: true }
    );

    if (!user) {
        const error = new Error("Utilizador não encontrado");
        error.statusCode = 404;
        throw error;
    }

    return { avatarUrl: user.avatarUrl };
};

module.exports = { deleteUser, updateAvatar };    