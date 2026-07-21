const dotenv = require("dotenv");
dotenv.config(); // Load environment variables first

const connectDB = require("./db/index.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const { urlencoded } = express;

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(",") || "*", // Support multiple origins if needed
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Test Route
app.get('/home', (req, res) => {
    res.send("This project is for dental clinic");
});

// Import Routes
const UserRouter = require("./routes/user.route.js");
const DoctorRouter = require("./routes/doctor.route.js");

// Use Routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/doctor", DoctorRouter);

// Start Server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    });
