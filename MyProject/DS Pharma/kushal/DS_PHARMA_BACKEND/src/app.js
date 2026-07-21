import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();

const masterSyncLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "192.168.0.189:5173",
      "192.168.0.168:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan(":method :url :status - :response-time ms"));

// Routes import
import authRouter from "./modules/auth/auth.route.js";
import categoryRouter from "./modules/category/category.route.js";
import masterSyncRouter from "./modules/mastersync/masterSync.route.js";
import productRoute from "./modules/products/product.route.js";
import partyRouter from "./modules/party/party.route.js";
import orderRouter from "./modules/order/order.route.js";

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/parties", partyRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/master-sync", masterSyncLimiter, masterSyncRouter);

export default app;
