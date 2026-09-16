const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile",
        required: true,
    }

}, { timestamps: true });

followSchema.index({ followerId: 1, mentorId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;