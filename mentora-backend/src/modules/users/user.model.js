const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatarUrl: {
        type: String,
        default: ""
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["mentor", "mentee", "admin"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;