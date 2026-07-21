import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Create Express app
const app = express();

// CORS options with multiple allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5174', 
      'http://localhost:6083',
      'https://afsana-nursery.pages.dev'
    ];

    // console.log("Incoming Origin:", origin); // Log the origin for debugging

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // console.error("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Test route
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server running and CORS enabled correctly!",
  });
});

// Log unhandled routes
app.use((req, res, next) => {
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  next();
});

// Import routes
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/product.routes.js";

// Register routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Export the app
export { app };
