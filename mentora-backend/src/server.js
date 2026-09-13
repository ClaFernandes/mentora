require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const menteeRoutes = require("./modules/users/mentee.routes");
const mentorRoutes = require("./modules/users/mentor.routes");
const offeringRoutes = require("./modules/users/offering.routes");
const followRoutes = require("./modules/users/follow.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");
const postRoutes = require("./modules/feed/post.routes");
const commentRoutes = require("./modules/feed/comment.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const availabilityRoutes = require("./modules/booking/availability.routes");
const sessionRoutes = require("./modules/booking/session.routes");
const paymentRoutes = require("./modules/payments/payment.routes");
const {
  stripeWebhookController,
} = require("./modules/payments/payment.controller");

const app = express();

connectDB();

app.use(cors());

app.use(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookController,
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/mentees", menteeRoutes);
app.use("/mentors", mentorRoutes);
app.use("/mentors/me/offerings", offeringRoutes);
app.use("/mentors", followRoutes);
app.use("/notifications", notificationRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);
app.use("/", uploadRoutes);
app.use("/mentors", availabilityRoutes);
app.use("/sessions", sessionRoutes);
app.use("/sessions", paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
