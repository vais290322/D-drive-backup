import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import sliderImageRoutes from "./src/routes/sliderimageRoutes.js";
import offerRoutes from "./src/routes/offerRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoute.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import shippingAddressRoutes from "./src/routes/shippingaddressRoutes.js";
import storeRoutes from "./src/routes/storeRoutes.js";
import subCategoryRoutes from "./src/routes/subCategoryRoutes.js";
import paymentRoutes from "./src/routes/paymentRoute.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import deliveryAssiRoutes from "./src/routes/deliveryassiRoute.js";
import shippingpriceRoutes from "./src/routes/shippingpriceRoutes.js";

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://192.168.0.144:5174", "http://192.168.0.144:5175", "http://192.168.0.144:4173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// DB
await connectDB();
 
// Routes
app.use("/api/v1/auth/users", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/banners", sliderImageRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/shippingaddress", shippingAddressRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/subcategory", subCategoryRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/deliveryassignment", deliveryAssiRoutes);
app.use("/api/v1/shippingprice", shippingpriceRoutes);

// Health
app.get("/get", (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, message: err.message || "Server error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SpeedNode API running on http://localhost:${port}`);
});
