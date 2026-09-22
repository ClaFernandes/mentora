const mongoose = require("mongoose");

let cached = global._mongooseConn;
if (!cached) {
    cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI)
            .then((m) => {
                console.log("MongoDB conectado!");
                return m;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("Erro ao conectar ao MongoDB", error.message);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;