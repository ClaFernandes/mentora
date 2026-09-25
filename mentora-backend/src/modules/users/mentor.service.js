const MentorProfile = require("./mentor.model");
const Offering = require("../offerings/offering.model");
const Follow = require("../follow/follow.model");
const { MENTORSHIP_AREAS } = require("../../utils/constants");

const getMentorProfile = async (userId) => {
    const mentorProfile = await MentorProfile.findOne({ userId }).populate("userId", "name surname email avatarUrl");

    if (!mentorProfile) {
        const error = new Error("Perfil de mentor não encontrado");
        error.statusCode = 404;
        throw error;
    }

    const offerings = await Offering.find({ mentorId: mentorProfile._id });

    const followersCount = await Follow.countDocuments({ mentorId: mentorProfile._id });

    return {
        ...mentorProfile.toObject(),
        offerings,
        followersCount,
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
    const offeringMatch = {};

    if (filters.area) {
        if (filters.area === "Outras") {
            offeringMatch.area = { $nin: MENTORSHIP_AREAS };
        } else {
            offeringMatch.area = filters.area;
        }
    };

    if (filters.minPrice || filters.maxPrice) {
        offeringMatch.sessionPrice = {};
        if (filters.minPrice) offeringMatch.sessionPrice.$gte = Number(filters.minPrice);
        if (filters.maxPrice) offeringMatch.sessionPrice.$lte = Number(filters.maxPrice);
    };

    if (filters.q) {
        const escapedQ = String(filters.q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        offeringMatch.title = { $regex: escapedQ, $options: "i" };
    };

    const pipeline = [];

    if (Object.keys(offeringMatch).length > 0) {
        pipeline.push({ $match: offeringMatch });
    }

    pipeline.push({ $sort: { sessionPrice: 1 } });

    pipeline.push({
        $group: {
            _id: "$mentorId",
            minPrice: { $min: "$sessionPrice" },
            matchedOfferings: {
                $push: {
                    _id: "$_id",
                    title: "$title",
                    area: "$area",
                    sessionPrice: "$sessionPrice",
                },
            },
        },
    });

    pipeline.push({
        $lookup: {
            from: "mentorprofiles",
            localField: "_id",
            foreignField: "_id",
            as: "mentor",
        },
    });
    pipeline.push({ $unwind: "$mentor" });

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "mentor.userId",
            foreignField: "_id",
            as: "mentorUser",
        },
    });
    pipeline.push({ $unwind: "$mentorUser" });

    const mentorMatch = {
        "mentor.rejected": false,
        "mentorUser.status": { $ne: "suspended" },
    };

    if (filters.minRating) {
        mentorMatch["mentor.avgRating"] = { $gte: Number(filters.minRating) };
    }
    pipeline.push({ $match: mentorMatch });

    if (filters.sortBy === "priceAsc") {
        pipeline.push({ $sort: { minPrice: 1 } });
    } else {
        pipeline.push({ $sort: { "mentor.avgRating": -1 } });
    }

    const skip = (page - 1) * limit;
    pipeline.push({
        $facet: {
            results: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
        },
    });

    const [aggResult] = await Offering.aggregate(pipeline);
    const total = aggResult.totalCount[0]?.count || 0;
    const mentorIds = aggResult.results.map((r) => r._id);

    const matchedOfferingsByMentor = new Map(
        aggResult.results.map((r) => [r._id.toString(), r.matchedOfferings])
    );

    const mentors = await MentorProfile.find({ _id: { $in: mentorIds } })
        .populate("userId", "name surname email avatarUrl");

    const orderedMentors = mentorIds
        .map((id) => mentors.find((m) => m._id.toString() === id.toString()))
        .filter(Boolean);

    const mentorsWithOfferings = orderedMentors.map((mentor) => ({
        ...mentor.toObject(),
        offerings: matchedOfferingsByMentor.get(mentor._id.toString()) || [],
    }));

    return {
        mentors: mentorsWithOfferings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

const getMyFollowers = async (userId) => {
    const mentorProfile = await MentorProfile.findOne({ userId });

    if (!mentorProfile) {
        const error = new Error("Perfil de mentor não encontrado");
        error.statusCode = 404;
        throw error;
    }

    const follows = await Follow.find({ mentorId: mentorProfile._id })
        .populate("followerId", "name surname avatarUrl")
        .sort({ createdAt: -1 });

    return follows.map((f) => f.followerId).filter(Boolean);
};

const removeFollower = async (mentorUserId, followerId) => {
    const mentorProfile = await MentorProfile.findOne({ userId: mentorUserId });

    if (!mentorProfile) {
        const error = new Error("Perfil de mentor não encontrado");
        error.statusCode = 404;
        throw error;
    }

    await Follow.deleteOne({ followerId, mentorId: mentorProfile._id });

    return { message: "Seguidor removido com sucesso" };
};

module.exports = { getMentorProfile, updateMentorProfile, searchMentors, getMyFollowers, removeFollower };
