import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.route.js";
import ledgerRouter from "./src/routes/ledger.route.js";
import { ApiError } from "./src/utils/apiError.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5174",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ledger", ledgerRouter);

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Expense Tracker Backend API 🚀</h1>");
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }
    console.error("Unhandle Error:", err);
    return res.status(500).json({
        statusCode: 500,
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export { app };