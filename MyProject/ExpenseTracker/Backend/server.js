
import connectDB from "./src/db/index.js";
import { app } from "./app.js";



connectDB().then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`sever is running at port : ${process.env.PORT}`);

    } )
}).catch((error)=>{
    console.log("mongodb connection failed !!!!");
})