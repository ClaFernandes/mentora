const { registerUser, loginUser, getMe, forgotPassword, resetPassword, changePassword } = require("./auth.service");

const registerUserController = async (req, res) => {
    const { name, surname, birthDate, email, password, confirmPassword, role } = req.body;
    const result = await registerUser({ name, surname, birthDate, email, password, confirmPassword, role });
    res.status(201).json(result);
};

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
};

const getMeController = async (req, res) => {
    const result = await getMe(req.user.id);
    res.status(200).json(result);
}

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.status(200).json(result);
}

const resetPasswordController = async (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;
    const result = await resetPassword({ token, newPassword, confirmNewPassword });
    res.status(200).json(result);
}

const changePasswordController = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const result = await changePassword(req.user.id, { currentPassword, newPassword, confirmNewPassword });
    res.status(200).json(result);
}

module.exports = { registerUserController, loginUserController, getMeController, forgotPasswordController, resetPasswordController, changePasswordController };