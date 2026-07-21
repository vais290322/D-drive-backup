import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes import
import attendanceRoutes from "./src/routes/attendance.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import teacherRoutes from "./src/routes/teacher.route.js"
import studentLateTimeRoutes from "./src/routes/studentLateTime.route.js"
import teacherLateTimeRoutes from "./src/routes/teacherLateTime.route.js"
import { ApiError } from "./src/utils/apiError.js";

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173', 
        'http://localhost:6084',
        'https://matiaankur-attendence.pages.dev',
      ];
  
      // console.log("Incoming Origin:", origin); // Log the origin for debugging
  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  // Apply CORS to all routes
  app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


app.get("/test", catchAsync(async (req, res) => {
  throw new ApiError(400, "Test error");
}));


// routes declaration
app.get("/", (req, res) => {
    res.send("Attendance Server is running  : 😁");
    
});

// API routes
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/students-lateTime", studentLateTimeRoutes);
app.use("/api/v1/teachers-lateTime", teacherLateTimeRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // For any other unhandled errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    stack: process.env.NODE_ENV === "production" ? err.stack : undefined
  });
});

// http://localhost:8000/api/v1/users/register
export { app };