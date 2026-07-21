import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import { checkAssetOwnerStatus } from "./src/middlewares/assetSecurity.middleware.js";

// Serve uploaded files statically with owner status check
app.use("/uploads", checkAssetOwnerStatus, express.static(path.join(__dirname, "uploads")));

// Import routes
import authRouter from "./src/routes/auth.routes.js";
import fileRouter from "./src/routes/file.routes.js";
import apiKeyRouter from "./src/routes/apiKey.routes.js";
import folderRouter from "./src/routes/folder.routes.js";
import adminRouter from "./src/routes/admin.routes.js";

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/api-keys", apiKeyRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/admin", adminRouter);

// Health check route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "File Upload API is running",
        version: "1.0.0",
        endpoints: {
            auth: "/api/v1/auth",
            files: "/api/v1/files",
            apiKeys: "/api/v1/api-keys"
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error:", err);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

export { app };