const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../../config/mailer");
const User = require("../users/user.model");
const MentorProfile = require("../users/mentor.model");
const MenteeProfile = require("../users/mentee.model");

const registerUser = async ({
  name,
  surname,
  birthDate,
  email,
  password,
  confirmPassword,
  role,
}) => {
  if (password !== confirmPassword) {
    const error = new Error("As palavras-passe não coincidem");
    error.statusCode = 400;
    throw error;
  }

  const MIN_PASSWORD_LENGTH = 8;
  if (password.length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      `A palavra-passe deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
    );
    error.statusCode = 400;
    throw error;
  }

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  if (!strongPasswordRegex.test(password)) {
    const error = new Error(
      "A palavra-passe deve conter maiúscula, minúscula, número e carácter especial",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!birthDate) {
    const error = new Error("A data de nascimento é obrigatória");
    error.statusCode = 400;
    throw error;
  }

  const today = new Date();
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    const error = new Error("Data de nascimento inválida");
    error.statusCode = 400;
    throw error;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;

  if (age < 18) {
    const error = new Error("É necessário ter pelo menos 18 anos para te registares");
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
    surname,
    birthDate,
    passwordHash,
    role,
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
    { expiresIn: "24h" },
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Email ou palavra-passe inválidos");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    const error = new Error("Email ou palavra-passe inválidos");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("Utilizador não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user._id,
    name: user.name,
    surname: user.surname,
    birthDate: user.birthDate,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message:
        "Se o email estiver registado, receberá instruções para redefinir a palavra-passe.",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = Date.now() + 15 * 60 * 1000;

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpires;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/mentora/update-password?token=${resetToken}`;

  await transporter.sendMail({
    from: '"Mentora" <no-reply@mentora.com>',
    to: user.email,
    subject: "Recuperação de Palavra-Passe - Mentora",
    html: `
            <p>Olá ${user.name},</p>
            <p>Recebemos um pedido para redefinir a sua palavra-passe.</p>
            <p>Clica no link abaixo:</p>
            <a href="${resetLink}" target="_blank">Redefinir Palavra-Passe</a>
            <p>Este link expira em 15 minutos.</p>
            <p>Se você não solicitou esta redefinição, por favor, ignore este email.</p>
        `,
  });
  return {
    message:
      "Se o email estiver registado, receberá instruções para redefinir a palavra-passe.",
  };
};

const resetPassword = async ({ token, newPassword, confirmNewPassword }) => {
  if (newPassword !== confirmNewPassword) {
    const error = new Error("As palavras-passe não coincidem");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Token inválido ou expirado");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordHash = passwordHash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Palavra-passe redefinida com sucesso" };
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
