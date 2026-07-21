import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Fixed: was "Credential" (wrong casing)
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
import authRouter from "./src/routes/auth.route.js";
import { ApiError } from "./src/utils/apiError.js";
// Health check
app.get("/", (req, res) => {
  res.send("<h1>Backend API is running 🚀</h1>");
});
app.use("/api/v1/auth", authRouter);





app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(
    new ApiError(500, "Internal Server Error")
  );
});

export { app };