const MentorProfile = require("./mentor.model");
const Offering = require("./offering.model");

const getMentorProfile = async (userId) => {
    const mentorProfile = await MentorProfile.findOne({ userId }).populate("userId", "name email avatarUrl");

    if (!mentorProfile) {
        const error = new Error("Perfil de mentor não encontrado");
        error.statusCode = 404;
        throw error;
    }

    const offerings = await Offering.find({ mentorId: mentorProfile._id });

    return {
        ...mentorProfile.toObject(),
        offerings,
    };
};

module.exports = { getMentorProfile };
