const { registerUser, loginUser, getMe } = require("./auth.service");

const register = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    const result = await registerUser({ name, email, password, confirmPassword, role });

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

module.exports = { register, login, me };