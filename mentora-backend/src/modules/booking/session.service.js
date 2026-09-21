const { Session } = require("./booking.models");
const Offering = require("../offerings/offering.model");
const MentorProfile = require("../users/mentor.model");
const { getAvailableSlots } = require("./availability.service");
const stripe = require("../../config/stripe");
const Payment = require("../payments/payment.model");
const Conversation = require("../chat/conversation.model");
const Message = require("../chat/message.model");

const createSession = async (userId, userRole, sessionData) => {
  if (userRole !== "mentee") {
    const error = new Error("Só mentees podem marcar sessões");
    error.statusCode = 403;
    throw error;
  }

  const { mentorId, offeringId, date, time } = sessionData;

  const mentorProfile = await MentorProfile.findOne({
    userId: sessionData.mentorId,
  });

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const offering = await Offering.findById(offeringId);

  if (!offering || !offering.mentorId.equals(mentorProfile._id)) {
    const error = new Error("Oferta inválida para este mentor");
    error.statusCode = 400;
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
    mentorId: mentorProfile._id,
    menteeId: userId,
    offeringId,
    date,
    time,
    status: "pending",
  });

  try {
    let conversation = await Conversation.findOne({
      offeringId,
      menteeId: userId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        offeringId,
        menteeId: userId,
      });
    }

    await Message.create({
      conversationId: conversation._id,
      senderId: mentorProfile.userId,
      text: "Sessão marcada! Usa este chat para combinar os detalhes (link da chamada, horário, etc.) antes da tua sessão.",
    });

    conversation.unreadByMentee = true;
    await conversation.save();
  } catch (chatError) {
    console.error(
      "Falha ao abrir o chat automático da sessão:",
      chatError,
    );
  }

  return newSession;
};

const getSessions = async (userId, userRole) => {
  let sessions;

  if (userRole === "mentee") {
    sessions = await Session.find({ menteeId: userId }).populate({
      path: "mentorId",
      populate: {
        path: "userId",
        select: "name surname email avatarUrl",
      },
    })
      .populate("offeringId")
      .sort({ date: 1, time: 1 });
  } else if (userRole === "mentor") {
    const mentorProfile = await MentorProfile.findOne({ userId });
    sessions = await Session.find({ mentorId: mentorProfile._id })
      .populate("menteeId", "name surname email avatarUrl")
      .populate("offeringId")
      .sort({ date: 1, time: 1 });;
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

  const payment = await Payment.findOne({ sessionId, status: "paid" });

  if (payment) {
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
    });

    payment.status = "refunded";
    await payment.save();
  }

  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    { $set: { status: "cancelled" } },
    { new: true },
  )
    .populate({
      path: "mentorId",
      populate: {
        path: "userId",
        select: "name surname email avatarUrl",
      },
    })
    .populate("menteeId", "name surname email avatarUrl");

  return updatedSession;
};

const rateSession = async (sessionId, userId, { rating, reviewText }) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    const error = new Error("Sessão não encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (session.menteeId.toString() !== userId.toString()) {
    const error = new Error("Não tens permissão para avaliar esta sessão");
    error.statusCode = 403;
    throw error;
  }

  if (session.rating) {
    const error = new Error("Esta sessão já foi avaliada");
    error.statusCode = 400;
    throw error;
  }

  const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
  const now = new Date();
  const isCompleted = session.status === "confirmed" && sessionDateTime < now;

  if (!isCompleted) {
    const error = new Error("Só é possível avaliar sessões já concluídas");
    error.statusCode = 400;
    throw error;
  }

  if (!rating || rating < 1 || rating > 5) {
    const error = new Error("A avaliação deve ser um número entre 1 e 5");
    error.statusCode = 400;
    throw error;
  }

  session.status = "completed";
  session.rating = rating;
  session.reviewText = reviewText || "";
  await session.save();

  const ratedSessions = await Session.find({
    mentorId: session.mentorId,
    rating: { $exists: true, $ne: null },
  });

  const totalRating = ratedSessions.reduce((sum, s) => sum + s.rating, 0);
  const avgRating = totalRating / ratedSessions.length;

  await MentorProfile.findByIdAndUpdate(session.mentorId, {
    $set: { avgRating: Math.round(avgRating * 10) / 10 },
  });

  const populatedSession = await Session.findById(session._id)
    .populate({
      path: "mentorId",
      populate: {
        path: "userId",
        select: "name surname email avatarUrl",
      },
    })
    .populate("menteeId", "name surname email avatarUrl")
    .populate("offeringId");

  return populatedSession;
};

module.exports = { createSession, getSessions, cancelSession, rateSession };
