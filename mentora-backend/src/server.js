require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const menteeRoutes = require("./modules/users/mentee.routes");
const mentorRoutes = require("./modules/users/mentor.routes");
const offeringRoutes = require("./modules/users/offering.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/mentees", menteeRoutes);
app.use("/mentors", mentorRoutes);
app.use("/mentors/me/offerings", offeringRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});