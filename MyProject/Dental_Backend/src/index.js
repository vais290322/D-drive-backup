import dotenv from "dotenv"
import connectDB from "./db/index.js"
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

dotenv.config({
    path:'./.env'
})
// console.log(process.env.CORS_ORIGIN)
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Adjust headers as needed
}))

app.use(express.json({limit:"16kb"}));
app.use(urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

app.get('/home',(req,res)=>{
    res.send("this project for detal ")
})
// import routes 
import UserRouter from './routes/user.route.js'
import DoctorRouter from './routes/doctor.route.js'

// route integrate 
app.use("/api/v1/user",UserRouter)
app.use("/api/v1/doctor",DoctorRouter)


connectDB().then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`server is running at port : ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log("mongodb connection failed",error)
})