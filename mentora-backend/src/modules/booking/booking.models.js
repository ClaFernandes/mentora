const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile",
        required: true,
    },
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const sessionSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile",
        required: true,
    },
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    offeringId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offering",
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    reviewText: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const Availability = mongoose.model("Availability", availabilitySchema);
const Session = mongoose.model("Session", sessionSchema);

module.exports = { Availability, Session };