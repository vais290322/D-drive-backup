const express = require("express");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
require("./db/db");
const dotenv = require("dotenv");
dotenv.config({ quiet: true });

const Register = require("./route/register.route");
const Category = require("./route/category.route");
const SubCategories = require("./route/subCategory.route");
const MainCategory = require("./route/mainCategory.route");
const Product = require("./route/product.route");
const Coupon = require("./route/coupon.route");
const Tax = require("./route/tax.route");
const TitleRoutes = require("./route/title.route");
const Slide = require("./route/slide.route");
const PaymentRoutes = require("./route/payment.route");
const Cart = require("./route/cart.route");
const Wishlist = require("./route/wishlist.route");
const Order = require("./route/order.route");
const Enquiry = require("./route/enquiry.route");
const Shipping = require("./route/shipping.route");
const ShippingPrice = require("./route/shippingPrice.route");
const UploadExcel = require("./route/upload.route");
const { checkEvents  } = require("./controller/register.controller"); // <-- Add this line
// const Contact = require("./route/contact.route");

const PORT = process.env.PORT ;

const corsOptions = {
  origin: "*", // Allow only frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(Register);
app.use(Category);
app.use(SubCategories);
app.use(MainCategory);
app.use(Product);
app.use(Coupon);
app.use(Tax);
app.use(TitleRoutes);
app.use(Slide);
app.use(Order);
app.use(Enquiry);
app.use(Shipping);
app.use(ShippingPrice);
app.use(UploadExcel);

// user Section
app.use(Cart);
app.use(Wishlist);
app.use(PaymentRoutes);



cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily birthday and anniversary check...");
  await checkEvents({ body: {} }, { json: console.log });
});

app.listen(PORT, () => {
  console.log(`Server Connected on port ${PORT}`);
});
