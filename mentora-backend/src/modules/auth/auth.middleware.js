const jwt = require("jsonwebtoken");
const User = require("../users/user.model");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("Token não fornecido");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        error.statusCode = 401;
        error.message = "Token inválido ou expirado";
        throw error;
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        const error = new Error("Conta inexistente");
        error.statusCode = 401;
        throw error;
    }

    if (user.status === "suspended") {
        const error = new Error("A tua conta está suspensa");
        error.statusCode = 403;
        throw error;
    }

    req.user = decoded;
    next();
}

const requireAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        const error = new Error("Acesso restrito a administradores");
        error.statusCode = 403;
        throw error;
    }

    const admin = await User.findById(req.user.id);

    if (!admin || admin.status !== "active") {
        const error = new Error("Conta de administrador inativa ou inexistente");
        error.statusCode = 403;
        throw error;
    }

    next();
}

module.exports = { verifyToken, requireAdmin };