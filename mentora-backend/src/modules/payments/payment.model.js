const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
        unique: true
    },
    stripePaymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },
    paidAt: {
        type: Date
    }

}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
