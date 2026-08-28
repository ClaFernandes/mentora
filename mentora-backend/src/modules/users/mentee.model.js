const mongoose = require("mongoose");

const menteeProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    interests: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const MenteeProfile = mongoose.model("MenteeProfile", menteeProfileSchema);

module.exports = MenteeProfile;