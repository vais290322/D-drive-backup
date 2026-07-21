import  express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();


const allowedOrigins = [
  "http://localhost:6081",
  "https://jrmondalnursery.com",
  "https://www.jrmondalnursery.com",
  "https://jrmondalnursery.pages.dev"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

  

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

// routes import 
import userRouter from "./routes/users.routes.js"
import productRouter from "./routes/product.routes.js"
// routes declaration 
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

// http://localhost:8080/api/v1/users/register
// http://localhost:8080/api/v1/products/upload-product
export  {app};
