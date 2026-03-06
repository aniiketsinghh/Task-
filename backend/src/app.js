const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/v1/auth.routes");
const nodeRoutes = require("./routes/v1/node.routes");
const userRoutes = require("./routes/v1/user.routes");
const errorHandler = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());                          // Set secure HTTP headers
app.use(mongoSanitize());                   // Prevent NoSQL injection via query strings

// Rate limiting — applied globally; tighten per-route as needed
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ─── General Middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));   // Restrict origin in production
app.use(express.json({ limit: "10kb" }));            // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));                              // HTTP request logger

// ─── API Routes (v1) ──────────────────────────────────────────────────────────
app.use("/api/v1/auth",  authRoutes);
app.use("/api/v1/nodes", nodeRoutes);
app.use("/api/v1/users", userRoutes);

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "API is up and running." })
);

// ─── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
