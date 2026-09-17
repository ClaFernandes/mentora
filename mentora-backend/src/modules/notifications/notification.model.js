const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["like", "comment", "message"],
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    offeringId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offering",
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
