const Conversation = require("./conversation.model");
const Message = require("./message.model");
const Offering = require("../offerings/offering.model");
const MentorProfile = require("../users/mentor.model");

const getConversations = async (userId, userRole) => {
    let conversations;

    if (userRole === "mentor") {
        const mentorProfile = await MentorProfile.findOne({ userId });
        if (!mentorProfile) {
            const error = new Error("Perfil de mentor não encontrado");
            error.statusCode = 404;
            throw error;
        }

        const offerings = await Offering.find({ mentorId: mentorProfile._id });
        const offeringIds = offerings.map((o) => o._id);

        const found = await Conversation.find({ offeringId: { $in: offeringIds } })
            .populate("offeringId", "title")
            .populate("menteeId", "name surname avatarUrl");

        conversations = found.map((conv) => ({
            id: conv._id,
            offering: { id: conv.offeringId._id, title: conv.offeringId.title },
            otherUser: {
                id: conv.menteeId._id,
                name: conv.menteeId.name,
                surname: conv.menteeId.surname,
                avatarUrl: conv.menteeId.avatarUrl,
            },
            hasUnread: conv.unreadByMentor,
        }));
    } else if (userRole === "mentee") {
        const found = await Conversation.find({ menteeId: userId }).populate({
            path: "offeringId",
            select: "title mentorId",
            populate: {
                path: "mentorId",
                select: "userId",
                populate: { path: "userId", select: "name surname avatarUrl" },
            },
        });

        conversations = found.map((conv) => ({
            id: conv._id,
            offering: { id: conv.offeringId._id, title: conv.offeringId.title },
            otherUser: {
                id: conv.offeringId.mentorId.userId._id,
                name: conv.offeringId.mentorId.userId.name,
                surname: conv.offeringId.mentorId.userId.surname,
                avatarUrl: conv.offeringId.mentorId.userId.avatarUrl,
            },
            hasUnread: conv.unreadByMentee,
        }));
    }

    return conversations;
};

const sendMessage = async (offeringId, userId, userRole, { text, menteeId }) => {
    const offering = await Offering.findById(offeringId);
    if (!offering) {
        const error = new Error("Oferta não encontrada");
        error.statusCode = 404;
        throw error;
    }

    const mentorProfile = await MentorProfile.findById(offering.mentorId);
    if (!mentorProfile) {
        const error = new Error("Mentor não encontrado");
        error.statusCode = 404;
        throw error;
    }

    let resolvedMenteeId;

    if (userRole === "mentee") {
        resolvedMenteeId = userId;
    } else if (userRole === "mentor") {
        if (mentorProfile.userId.toString() !== userId.toString()) {
            const error = new Error("Não tens permissão para responder nesta oferta");
            error.statusCode = 403;
            throw error;
        }
        if (!menteeId) {
            const error = new Error("menteeId é obrigatório para o mentor responder");
            error.statusCode = 400;
            throw error;
        }
        resolvedMenteeId = menteeId;
    } else {
        const error = new Error("Apenas mentores e mentorados podem usar o chat");
        error.statusCode = 403;
        throw error;
    }

    let conversation = await Conversation.findOne({
        offeringId,
        menteeId: resolvedMenteeId,
    });

    if (!conversation) {
        if (userRole !== "mentee") {
            const error = new Error(
                "Não é possível iniciar uma conversa como mentor — aguarda a primeira mensagem do mentorado",
            );
            error.statusCode = 403;
            throw error;
        }

        conversation = await Conversation.create({
            offeringId,
            menteeId: resolvedMenteeId,
        });
    }

    const message = await Message.create({
        conversationId: conversation._id,
        senderId: userId,
        text,
    });

    if (userRole === "mentee") {
        conversation.unreadByMentor = true;
    } else {
        conversation.unreadByMentee = true;
    }
    await conversation.save();

    return message;
};

const getAllMessages = async (offeringId, userId) => {
    const offering = await Offering.findById(offeringId);
    if (!offering) {
        const error = new Error("Oferta não encontrada");
        error.statusCode = 404;
        throw error;
    }

    const mentorProfile = await MentorProfile.findById(offering.mentorId);
    if (!mentorProfile || mentorProfile.userId.toString() !== userId.toString()) {
        const error = new Error("Apenas o dono da oferta pode ver todas as mensagens");
        error.statusCode = 403;
        throw error;
    }

    const conversations = await Conversation.find({ offeringId });
    const conversationIds = conversations.map((c) => c._id);

    const messages = await Message.find({
        conversationId: { $in: conversationIds },
    }).sort({ createdAt: 1 });

    return messages;
};

const getMessagesBySender = async (offeringId, senderId, userId) => {
    const offering = await Offering.findById(offeringId);
    if (!offering) {
        const error = new Error("Oferta não encontrada");
        error.statusCode = 404;
        throw error;
    }

    const mentorProfile = await MentorProfile.findById(offering.mentorId);
    const isMentorOwner =
        mentorProfile && mentorProfile.userId.toString() === userId.toString();
    const isSenderSelf = userId.toString() === senderId.toString();

    if (!isMentorOwner && !isSenderSelf) {
        const error = new Error("Não tens permissão para ver estas mensagens");
        error.statusCode = 403;
        throw error;
    }

    const conversation = await Conversation.findOne({
        offeringId,
        menteeId: senderId,
    });

    if (!conversation) {
        return [];
    }

    const messages = await Message.find({
        conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return messages;
};

const markConversationAsRead = async (conversationId, userId, userRole) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        const error = new Error("Conversa não encontrada");
        error.statusCode = 404;
        throw error;
    }

    if (userRole === "mentee") {
        if (conversation.menteeId.toString() !== userId.toString()) {
            const error = new Error("Não tens permissão para marcar esta conversa como lida");
            error.statusCode = 403;
            throw error;
        }
        conversation.unreadByMentee = false;
    } else if (userRole === "mentor") {
        const offering = await Offering.findById(conversation.offeringId);
        const mentorProfile = await MentorProfile.findById(offering.mentorId);

        if (mentorProfile.userId.toString() !== userId.toString()) {
            const error = new Error("Não tens permissão para marcar esta conversa como lida");
            error.statusCode = 403;
            throw error;
        }
        conversation.unreadByMentor = false;
    } else {
        const error = new Error("Apenas mentores e mentorados podem usar o chat");
        error.statusCode = 403;
        throw error;
    }

    await conversation.save();
    return conversation;
};

module.exports = {
    getConversations,
    sendMessage,
    getAllMessages,
    getMessagesBySender,
    markConversationAsRead,
};