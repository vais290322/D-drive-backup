import app from "./app.js";
import DbConnection from "./DbConfig/DbConnection.js";

app.listen(process.env.PORT, async () => {
    await DbConnection();
    console.log(`Server is running on port ${process.env.PORT}`);
})  