const Offering = require('./offering.model');
const MentorProfile = require('./mentor.model');

const createOffering = async (userId, offeringData) => {
    const mentorProfile = await MentorProfile.findOne({ userId });

    if (!mentorProfile) {
        const error = new Error("Apenas mentores podem gerir ofertas");
        error.statusCode = 403;
        throw error;
    }

    const newOffering = await Offering.create({ ...offeringData, mentorId: mentorProfile._id });

    return newOffering;
}

const updateOffering = async (offeringId, userId, updates) => {
    const mentorProfile = await MentorProfile.findOne({ userId });

    if (!mentorProfile) {
        const error = new Error("Apenas mentores podem gerir ofertas");
        error.statusCode = 403;
        throw error;
    }

    const allowedUpdates = {};

    if (updates.title !== undefined) allowedUpdates.title = updates.title;
    if (updates.area !== undefined) allowedUpdates.area = updates.area;
    if (updates.sessionPrice !== undefined) allowedUpdates.sessionPrice = updates.sessionPrice;
    if (updates.description !== undefined) allowedUpdates.description = updates.description;

    const offering = await Offering.findOneAndUpdate(
        { _id: offeringId, mentorId: mentorProfile._id },
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    )

    if (!offering) {
        const error = new Error("Oferta não encontrada ou acesso negado");
        error.statusCode = 404;
        throw error;
    }

    return offering;
}

const deleteOffering = async (offeringId, userId) => {
    const mentorProfile = await MentorProfile.findOne({ userId });

    if (!mentorProfile) {
        const error = new Error("Apenas mentores podem gerir ofertas");
        error.statusCode = 403;
        throw error;
    }

    const offering = await Offering.findOneAndDelete({ _id: offeringId, mentorId: mentorProfile._id });

    if (!offering) {
        const error = new Error("Oferta não encontrada ou acesso negado");
        error.statusCode = 404;
        throw error;
    }

    return { message: "Oferta apagada com sucesso" };
}

module.exports = { createOffering, updateOffering, deleteOffering };