const MenteeProfile = require("./mentee.model");
const Follow = require("../follow/follow.model");
const { Session } = require("../booking/booking.models");

const getMenteeProfile = async (userId) => {
    const menteeProfile = await MenteeProfile.findOne({ userId }).populate("userId", "name surname email avatarUrl");

    if (!menteeProfile) {
        const error = new Error("Perfil de mentorado não encontrado");
        error.statusCode = 404;
        throw error;
    }

    const follows = await Follow.find({ followerId: userId }).populate("mentorId", "userId");
    const followingMentors = follows.map((f) => f.mentorId.userId.toString());

    const candidateSessions = await Session.find({
        menteeId: userId,
        status: { $in: ["completed", "confirmed"] },
    });
    const completedSessions = candidateSessions.filter((s) => {
        if (s.status === "completed") return true;
        return new Date(`${s.date}T${s.time}:00`) < new Date();
    }).length;

    return {
        ...menteeProfile.toObject(),
        followingMentors,
        completedSessions,
    };
}

const updateMenteeProfile = async (userId, updates) => {
    const allowedUpdates = {};

    if (updates.bio !== undefined) allowedUpdates.bio = updates.bio;
    if (updates.interests !== undefined) allowedUpdates.interests = updates.interests;

    const updatedProfile = await MenteeProfile.findOneAndUpdate(
        { userId },
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );

    if (!updatedProfile) {
        const error = new Error("Perfil de mentorado não encontrado");
        error.statusCode = 404;
        throw error;
    }

    return updatedProfile;
}

module.exports = { getMenteeProfile, updateMenteeProfile };