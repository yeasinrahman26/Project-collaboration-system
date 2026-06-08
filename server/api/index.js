const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true })); // ✅ fixed typo

// MongoDB Connection — lazy singleton for serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✓ MongoDB connected");
  } catch (err) {
    console.error("✗ MongoDB error:", err);
    throw err;
  }
};

// Middleware to connect DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).json({ message: "Database connection failed" });
  }
});

const loadRoute = (path) => {
  try {
    return require(path);
  } catch (err) {
    console.error(`Failed to load route: ${path}`, err.message);
    return require("express").Router(); // return empty router so app doesn't crash
  }
};

const authRoutes = loadRoute("../routes/auth");
const projectRoutes = loadRoute("../routes/projects");
const taskRoutes = loadRoute("../routes/tasks");
const commentRoutes = loadRoute("../routes/comments");
const notificationRoutes = loadRoute("../routes/notifications");
const dashboardRoutes = loadRoute("../routes/dashboard");
const searchRoutes = loadRoute("../routes/search");
const activityRoutes = loadRoute("../routes/activities");

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server running", timestamp: new Date() });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/activities", activityRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
