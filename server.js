const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");



dotenv.config();

const app = express();

connectDB();

app.use(cors({
   origin: [
    "http://localhost:5173",
    "https://trade-ethiopia-task-manager-fornten.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
const protect = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.send("You are authorized user");
});