const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const MentorProfile = require("../users/mentor.model");
const MenteeProfile = require("../users/mentee.model");

const registerUser = async ({ name, email, password, confirmPassword, role }) => {
    if (password !== confirmPassword) {
        const error = new Error("As palavras-passe não coincidem");
        error.statusCode = 400;
        throw error;
    }

    const MIN_PASSWORD_LENGTH = 8;
    if (password.length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`A palavra-passe deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`);
        error.statusCode = 400;
        throw error;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!strongPasswordRegex.test(password)) {
        const error = new Error("A palavra-passe deve conter maiúscula, minúscula, número e carácter especial");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("Já existe uma conta com este email");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        passwordHash,
        role
    });

    if (role === "mentor") {
        await MentorProfile.create({ userId: user._id });
    }

    if (role === "mentee") {
        await MenteeProfile.create({ userId: user._id });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

module.exports = { registerUser };

