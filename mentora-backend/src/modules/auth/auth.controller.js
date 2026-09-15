const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require("./auth.service");

const register = async (req, res) => {
    const { name, surname, birthDate, email, password, confirmPassword, role } = req.body;
    const result = await registerUser({ name, surname, birthDate, email, password, confirmPassword, role });
    res.status(201).json(result);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
};

const me = async (req, res) => {
    const result = await getMe(req.user.id);
    res.status(200).json(result);
}

const forgotPasswordHandler = async (req, res) => {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.status(200).json(result);
}

const resetPasswordHandler = async (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;
    const result = await resetPassword({ token, newPassword, confirmNewPassword });
    res.status(200).json(result);
}

module.exports = { register, login, me, forgotPasswordHandler, resetPasswordHandler };