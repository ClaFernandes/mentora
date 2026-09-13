const { Availability, Session } = require("./booking.models");
const MentorProfile = require("../users/mentor.model");

function generateSlotsForBlock(startTime, endTime) {
  const slots = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;

  let currentMin = startTotalMin;

  while (currentMin + 60 <= endTotalMin) {
    const h = Math.floor(currentMin / 60)
      .toString()
      .padStart(2, "0");
    const m = (currentMin % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    currentMin += 60;
  }

  return slots;
}

const getAvailableSlots = async (mentorUserId, date) => {
  const mentorProfile = await MentorProfile.findOne({ userId: mentorUserId });

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getUTCDay();

  const blocks = await Availability.find({
    mentorId: mentorProfile._id,
    dayOfWeek,
  });

  const allSlots = blocks
    .map((block) => generateSlotsForBlock(block.startTime, block.endTime))
    .flat();

  const bookedSessions = await Session.find({
    mentorId: mentorProfile._id,
    date: date,
    status: { $in: ["pending", "confirmed"] },
  });

  const bookedTimes = bookedSessions.map((session) => session.time);

  const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

  return availableSlots;
};

const getAvailability = async (mentorUserId) => {
  const mentorProfile = await MentorProfile.findOne({ userId: mentorUserId });

  if (!mentorProfile) {
    const error = new Error("Mentor não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const availability = await Availability.find({
    mentorId: mentorProfile._id,
  }).sort({ dayOfWeek: 1, startTime: 1 });

  return availability;
};

const createAvailability = async (userId, availabilityData) => {
  const mentorProfile = await MentorProfile.findOne({ userId });

  if (!mentorProfile) {
    const error = new Error("Apenas mentores podem gerir disponibilidade");
    error.statusCode = 403;
    throw error;
  }

  const existingBlocks = await Availability.find({
    mentorId: mentorProfile._id,
    dayOfWeek: availabilityData.dayOfWeek,
  });

  const hasOverlap = existingBlocks.some(
    (block) =>
      availabilityData.startTime < block.endTime &&
      availabilityData.endTime > block.startTime,
  );

  if (hasOverlap) {
    const error = new Error("Este horário sobrepõe-se a um bloco já existente");
    error.statusCode = 400;
    throw error;
  }

  const newAvailability = await Availability.create({
    ...availabilityData,
    mentorId: mentorProfile._id,
  });
  return newAvailability;
};

const deleteAvailability = async (availabilityId, userId) => {
  const mentorProfile = await MentorProfile.findOne({ userId });

  if (!mentorProfile) {
    const error = new Error("Apenas mentores podem gerir disponibilidades");
    error.statusCode = 403;
    throw error;
  }

  const availability = await Availability.findOneAndDelete({
    _id: availabilityId,
    mentorId: mentorProfile._id,
  });

  if (!availability) {
    const error = new Error("Disponibilidade não encontrada ou acesso negado");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Disponibilidade apagada com sucesso" };
};

module.exports = {
  getAvailableSlots,
  getAvailability,
  createAvailability,
  deleteAvailability,
};
