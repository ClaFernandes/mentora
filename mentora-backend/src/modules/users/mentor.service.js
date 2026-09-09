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

const updateMentorProfile = async (userId, updates) => {
    const allowedUpdates = {};

    if (updates.bio !== undefined) allowedUpdates.bio = updates.bio;
    if (updates.areas !== undefined) allowedUpdates.areas = updates.areas;

    const updatedProfile = await MentorProfile.findOneAndUpdate(
        { userId },
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );

    if (!updatedProfile) {
        const error = new Error("Perfil de mentor não encontrado");
        error.statusCode = 404;
        throw error;
    }

    return updatedProfile;
};

const searchMentors = async (filters, page, limit) => {
    const offeringFilter = {};

    // Filtro por área
    if (filters.area) {
        offeringFilter.area = filters.area;
    };

    // Filtros por preços min e max
    if (filters.minPrice || filters.maxPrice) {
        offeringFilter.sessionPrice = {};
        if (filters.minPrice) {
            offeringFilter.sessionPrice.$gte = Number(filters.minPrice);
        };
        if (filters.maxPrice) {
            offeringFilter.sessionPrice.$lte = Number(filters.maxPrice);
        };
    };

    // Filtro por texto no título da oferta
    if (filters.q) {
        offeringFilter.title = { $regex: filters.q, $options: "i" };
    }

    let mentorIdsFromOffering = null;

    // só corre a query se algum filtro foi escolhido
    if (Object.keys(offeringFilter).length > 0) {
        mentorIdsFromOffering = await Offering.distinct("mentorId", offeringFilter);
    };

    // Filtros aplicados, independente da pesquisa
    const mentorFilter = {
        rejected: false,
        isVerified: true,
    };

    // Filtro no MentorProfile
    if (filters.minRating) {
        mentorFilter.avgRating = { $gte: Number(filters.minRating) };
    };

    // Restringe por id se correu no começo
    if (mentorIdsFromOffering !== null) {
        mentorFilter._id = { $in: mentorIdsFromOffering };
    };

    // Paginação
    const skip = (page - 1) * limit;

    // Mentores ordenados
    const mentors = await MentorProfile.find(mentorFilter)
        .populate("userId", "name email avatarUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Total de mentores que cumprem o filtro
    const total = await MentorProfile.countDocuments(mentorFilter);

    // Para cada mentor desta página, vai buscar as suas ofertas reais
    const mentorsWithOfferings = await Promise.all(
        mentors.map(async (mentor) => {
            const offerings = await Offering.find({ mentorId: mentor._id });
            return { ...mentor.toObject(), offerings };
        })
    );
    return {
        mentors: mentorsWithOfferings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

module.exports = { getMentorProfile, updateMentorProfile, searchMentors };
