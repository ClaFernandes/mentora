const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile",
        required: true
    },
    type: {
        type: String,
        enum: ["text", "image"],
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    reported: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
