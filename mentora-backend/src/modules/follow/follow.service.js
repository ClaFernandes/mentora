const Follow = require("./follow.model");
const MentorProfile = require("../users/mentor.model");

const followMentor = async (followerId, followerRole, mentorUserId) => {
  if (followerRole !== "mentee") {
    const error = new Error("Apenas mentorados podem seguir mentores");
    error.statusCode = 403;
    throw error;
  }

  const mentorProfile = await MentorProfile.findOne({ userId: mentorUserId });

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const existingFollow = await Follow.findOne({
    followerId,
    mentorId: mentorProfile._id,
  });

  if (existingFollow) {
    const error = new Error("Já segues este mentor");
    error.statusCode = 400;
    throw error;
  }

  const follow = await Follow.create({
    followerId,
    mentorId: mentorProfile._id,
  });
  return follow;
};

const unfollowMentor = async (followerId, mentorUserId) => {
  const mentorProfile = await MentorProfile.findOne({ userId: mentorUserId });

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await Follow.deleteOne({ followerId, mentorId: mentorProfile._id });

  return { message: "Deixaste de seguir este mentor" };
};

module.exports = { followMentor, unfollowMentor };
