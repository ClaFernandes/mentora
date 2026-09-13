const { Session } = require("./booking.models");
const MentorProfile = require("../users/mentor.model");
const { getAvailableSlots } = require("./availability.service");

const createSession = async (userId, sessionData) => {
  const mentorProfile = await MentorProfile.findOne({
    userId: sessionData.mentorId,
  });

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const availableSlots = await getAvailableSlots(
    sessionData.mentorId,
    sessionData.date,
  );

  if (!availableSlots.includes(sessionData.time)) {
    const error = new Error("Este horário já não está disponível");
    error.statusCode = 400;
    throw error;
  }

  const newSession = await Session.create({
    ...sessionData,
    mentorId: mentorProfile._id,
    menteeId: userId,
  });

  return newSession;
};

const getSessions = async (userId, userRole) => {
  let sessions;

  if (userRole === "mentee") {
    sessions = await Session.find({ menteeId: userId }).populate({
      path: "mentorId",
      populate: {
        path: "userId",
        select: "name email avatarUrl",
      },
    });
  } else if (userRole === "mentor") {
    const mentorProfile = await MentorProfile.findOne({ userId });
    sessions = await Session.find({ mentorId: mentorProfile._id }).populate(
      "menteeId",
      "name email avatarUrl",
    );
  }
  return sessions;
};

const cancelSession = async (sessionId, userId) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    const error = new Error("Sessão não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const mentorProfile = await MentorProfile.findById(session.mentorId);

  const isMentee = session.menteeId.toString() === userId.toString();
  const isMentor = mentorProfile.userId.toString() === userId.toString();

  if (!isMentee && !isMentor) {
    const error = new Error("Não tens permissão para cancelar esta sessão");
    error.statusCode = 403;
    throw error;
  }

  const sessionDateTime = new Date(`${session.date}T${session.time}:00`);

  const now = new Date();
  const diffMs = sessionDateTime - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    const error = new Error("Só é possível cancelar até 24h antes da sessão");
    error.statusCode = 400;
    throw error;
  }

  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    { $set: { status: "cancelled" } },
    { new: true },
  );

  return updatedSession;
};

module.exports = { createSession, getSessions, cancelSession };
