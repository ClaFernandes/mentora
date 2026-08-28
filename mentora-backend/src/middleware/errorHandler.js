const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "Erro interno no servidor"
    });
};

module.exports = errorHandler;