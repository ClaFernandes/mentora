const stripe = require("../../config/stripe");
const { Session } = require("../booking/booking.models");

const createCheckoutSession = async (sessionId, userId) => {
  const session = await Session.findById(sessionId)
    .populate("offeringId")
    .populate("mentorId");

  if (!session) {
    const error = new Error("Sessão não encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (session.menteeId.toString() !== userId.toString()) {
    const error = new Error("Não tens permissão para pagar esta sessão");
    error.statusCode = 403;
    throw error;
  }

  if (session.status !== "pending") {
    const error = new Error("Esta sessão não está a aguardar pagamento");
    error.statusCode = 400;
    throw error;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: session.offeringId.title,
          },
          unit_amount: session.offeringId.sessionPrice * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/mentora/booking/success`,
    cancel_url: `${process.env.FRONTEND_URL}/mentora/booking/${session.mentorId.userId}`,
    metadata: {
      sessionId: session._id.toString(),
    },
  });

  return checkoutSession.url;
};

module.exports = { createCheckoutSession };
