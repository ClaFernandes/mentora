const mongoose = require("mongoose");

const offeringSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    sessionPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    level: {
      type: String,
      enum: ["iniciante", "intermedio", "avancado"],
      required: true,
    },
  },
  { timestamps: true },
);

const Offering = mongoose.model("Offering", offeringSchema);

module.exports = Offering;
