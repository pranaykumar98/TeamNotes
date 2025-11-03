require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// middleware
app.use(express.json());

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// database connection
connectDB();

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "working fine!" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/analytics", analyticsRoutes);

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
