const stripe = require("../../config/stripe");
const { Session } = require("../booking/booking.models");
const Payment = require("./payment.model");
const { createCheckoutSession } = require("./stripe.service");

const stripeWebhookController = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;

    const sessionId = checkoutSession.metadata.sessionId;

    try {
      const existingPayment = await Payment.findOne({ sessionId });

      if (existingPayment) {
        return res.status(200).json({ received: true });
      }

      await Session.findByIdAndUpdate(sessionId, {
        $set: { status: "confirmed" },
      });

      await Payment.create({
        sessionId,
        stripePaymentId: checkoutSession.payment_intent,
        amount: checkoutSession.amount_total / 100,
        status: "paid",
        paidAt: new Date(),
      });
    } catch (err) {
      console.error("Erro ao processar webhook do Stripe:", err);
      return res.status(500).json({ message: "Erro ao processar o pagamento" });
    }
  }

  res.status(200).json({ received: true });
};

const payController = async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.id;
  const result = await createCheckoutSession(sessionId, userId);
  res.status(200).json({ checkoutUrl: result });
};

module.exports = { stripeWebhookController, payController };