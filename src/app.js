import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.set("trust proxy", 1);

// Security
app.use(helmet());

// Logger
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use("/public", express.static("public"));

// Cookies
app.use(cookieParser());

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Error handler
app.use(errorHandler);

export { app };