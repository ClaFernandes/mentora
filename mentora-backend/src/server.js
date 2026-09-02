require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./modules/auth/auth.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});