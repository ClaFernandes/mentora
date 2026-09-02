const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("Token não fornecido");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        error.statusCode = 401;
        error.message = "Token inválido ou expirado";
        throw error;
    }
}

module.exports = { verifyToken };