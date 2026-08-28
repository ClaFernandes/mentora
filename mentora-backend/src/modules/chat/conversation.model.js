const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile",
        required: true,
    },
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    unreadByMentor: {
        type: Boolean,
        default: false
    },
    unreadByMentee: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

conversationSchema.index({ mentorId: 1, menteeId: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
