const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    areas: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    avgRating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);

module.exports = MentorProfile;