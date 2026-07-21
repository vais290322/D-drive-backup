import express from 'express';
import dotenv from "dotenv"
import cors from "cors";
import bodyParser from 'body-parser';
import ErrorHandler from "./helperFunctions/ErrorHandler.js"
import errorMiddleware from "./Middelwares/errorMiddleware.js"
import ResponseHandler from "./Middelwares/ResponseHandler.js"

import itemRoute from './Routes/item.route.js';
import inventoryItemRoute from './Routes/inventoryItems.routes.js';
import holdingItemRoute from './Routes/holdingItems.routes.js';
import currentItemRoute from './Routes/currentItems.routes.js';
import CompanyRouter from "./Routes/company.routes.js"
import PurchaseOrderRouter from "./Routes/ParchaseOrder.routes.js"
import unitRouter from "./Routes/productsUnit.routes.js"


import snigdhaitemRoute from './SnigdhaRoute/snigdhaItem.route.js';
import snigdhainventoryItemRoute from './SnigdhaRoute/snigdhaInventoryItems.route.js';
import snigdhaholdingItemRoute from './SnigdhaRoute/snigdhaHoldingitems.routes.js';
import snigdhacurrentItemRoute from './SnigdhaRoute/snigdhaCurrentItems.route.js';
import snigdhaCompanyRouter from "./SnigdhaRoute/snigdhaCompany.route.js"
import snigdhaPurchaseOrderRouter from "./SnigdhaRoute/snigdhaParchaseOrder.route.js"
import snigdhaunitRouter from "./SnigdhaRoute/snigdhaProductsUnit.route.js"





import authRouter from "./Routes/auth.routes.js"
import cookieParser from 'cookie-parser';
// import CompanyRouter from './MNS_PO_&_COMPANY/Routes/company.routes.js';
dotenv.config();
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: ["*",  "https://info.mnssecuresolutions.com", "http://localhost:5173", "http://localhost:4173"],
    credentials: true
}))

app.use("/api/v1/item", itemRoute);
app.use("/api/v1/inventory", inventoryItemRoute);
app.use("/api/v1/inventory", holdingItemRoute);
app.use("/api/v1/inventory", currentItemRoute);
app.use("/api/v1/company",CompanyRouter)
app.use("/api/v1/purchase-order",PurchaseOrderRouter)
app.use("/api/v1/units",unitRouter)


app.use("/s/api/v1/item", snigdhaitemRoute);
app.use("/s/api/v1/inventory", snigdhainventoryItemRoute);
app.use("/s/api/v1/inventory", snigdhaholdingItemRoute);
app.use("/s/api/v1/inventory", snigdhacurrentItemRoute);
app.use("/s/api/v1/company",snigdhaCompanyRouter)
app.use("/s/api/v1/purchase-order",snigdhaPurchaseOrderRouter)
app.use("/s/api/v1/units",snigdhaunitRouter)



app.use("/api/v1/auth", authRouter);



app.get("/error", (req, res, next) => {
    return next(new ErrorHandler("This is a custom error!", 400));
});
app.use("*", (req, res) => {
    ResponseHandler.error(res, "Page not found", 404);
});

// Global error handler (should be the last middleware)
app.use(errorMiddleware);






export default app;
