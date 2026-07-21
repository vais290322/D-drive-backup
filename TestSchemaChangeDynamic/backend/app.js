import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import productRouter from './route/product.route.js'
import schemaRouter from "./route/schema.route.js"

dotenv.config({ path: './.env' })

const app = express();

app.use(cors())

app.use(express.json());
app.use(cookieParser())

app.get("/home", (req , res)=>{
    res.send("server is running from home route 👌😘❤️😒😂💕😊😉🤣")
})

app.use("/api/v1/products", productRouter)
app.use("/api/v1/schema", schemaRouter)



export default app;