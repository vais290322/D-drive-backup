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
import ServiceRouter from "./Routes/service.routes.js"
import LagderRouter from "./Routes/ledgerAccount.route.js"
import PerfomaRouter from "./Routes/perfoma.route.js"
import ServicePerformaRouter from "./Routes/servicePerforma.route.js"
import AnalyticRouter from "./Routes/analytic.route.js"
import mnsPurchaseOrderNew from "./Routes/mnsPurchaseOrderNew.route.js"

// after new requirement on 10-04-2025
import groupRouter from "./Routes/group.route.js"
import bankRouter from "./Routes/bank.route.js"
import serviceAccountRouter from "./Routes/serviceAccount.route.js"
import depositCreditRouter from "./Routes/depositCredit.route.js"
import withdrawRouter from "./Routes/withdraw.route.js";
import imprestFundRouter from "./Routes/imprestFund.route.js";
import expenseRouter from "./Routes/expense.route.js";
import purchaseWindowRouter from "./Routes/purchaseWindow.route.js";
import purchaseAccountRouter from "./Routes/purchaseAccount.route.js";
import dummySlipRouter from "./Routes/dummySlip.route.js";
import notesRouter from "./Routes/notes.route.js";
import reportRoutes from './Routes/report.routes.js';
import moneyTransferRoutes from './Routes/moneyTransfer.routes.js';

import masterLedgerRoutes from "./Routes/masterLedger.routes.js";
import allLedgerRoute from "./Routes/mnsAllLedger.route.js";
import profitLossRoutes from './Routes/profitLoss.routes.js';
import creditDebitNotesRoutes from "./Routes/creditDebitNotes.routes.js";

// ? arnab golder added invoice
import invoiceRouter from './Routes/invoiceRoutes.js';
import mnsInvoiceRouter from './Routes/invoice-mns.routes.js';

// for snigdha 

import snigdhaitemRoute from './SnigdhaRoute/snigdhaItem.route.js';
import snigdhainventoryItemRoute from './SnigdhaRoute/snigdhaInventoryItems.route.js';
import snigdhaholdingItemRoute from './SnigdhaRoute/snigdhaHoldingitems.routes.js';
import snigdhacurrentItemRoute from './SnigdhaRoute/snigdhaCurrentItems.route.js';
import snigdhaCompanyRouter from "./SnigdhaRoute/snigdhaCompany.route.js"
import snigdhaPurchaseOrderRouter from "./SnigdhaRoute/snigdhaParchaseOrder.route.js"
import snigdhaunitRouter from "./SnigdhaRoute/snigdhaProductsUnit.route.js"
import snigdhaLagderRouter from "./SnigdhaRoute/snigdhaLadgerAccount.route.js"
import snigdhaAnalyticRouter from "./SnigdhaRoute/snigdhaAnalytic.route.js"
import snigdhaBulkRouter from "./SnigdhaRoute/snigdhaBulk.route.js"
import snigdhaPurchaseOrderNew from "./SnigdhaRoute/snigdhaPurchaseOrderNew.route.js"

// after new requirement on 10-04-2025
import snigdhaBankRouter from "./SnigdhaRoute/snigdhaBank.route.js";
import snigdhaDepositCreditRouter from "./SnigdhaRoute/snigdhaDepositCredit.route.js";
import snigdhaWithdrawRouter from "./SnigdhaRoute/snigdhaWithdraw.route.js";
import snigdhaImprestFundRouter from "./SnigdhaRoute/snigdhaImprestFund.route.js";
import snigdhaExpenseRouter from "./SnigdhaRoute/snigdhaExpense.route.js";
import snigdhaPurchaseWindowRouter from "./SnigdhaRoute/snigdhaPurchaseWindow.route.js";
import snigdhaPurchaseAccountRouter from "./SnigdhaRoute/snigdhaPurchaseAccount.route.js";
import snigdhaNotesRoutes from "./SnigdhaRoutes/snigdhaNotes.route.js";
import snigdhaMoneyTransferRoutes from './SnigdhaRoutes/snigdhaMoneyTransfer.routes.js';
import snigdhaReportRoutes from './SnigdhaRoutes/snigdhaReport.routes.js';

import snigdhaMasterLedgerRoutes from "./SnigdhaRoute/snigdhaMasterLedger.route.js";
import snigdhaAllLedgerRoute from "./SnigdhaRoute/snigdhaAllLedger.route.js";
import snigdhaProfitLossRoutes from "./SnigdhaRoute/snigdhaProfitLoss.route.js";
import snigdhaProductProformaRoutes from './SnigdhaRoutes/snigdhaProductProformInvoice.routes.js';
import snigdhaServiceInvoiceRoutes from './SnigdhaRoutes/snigdhaServiceInvoice.routes.js';
import snigdhaServiceLedgerRoutes from './SnigdhaRoutes/snigdhaServiceLedgerAccount.routes.js';
import snigdhaCreditDebitNotesRoutes from "./SnigdhaRoutes/snigdhaCreditDebitNotes.routes.js";

import newOrderRouter from "./SnigdhaRoute/newOrder.route.js"


import authRouter from "./Routes/auth.routes.js"
import cookieParser from 'cookie-parser';
// import router from './Routes/bulk.routes.js';
import bulkRouter from './Routes/bulk.routes.js';
// import CompanyRouter from './MNS_PO_&_COMPANY/Routes/company.routes.js';
dotenv.config();
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: ["*",  "https://info.mnssecuresolutions.com", "http://localhost:5173", "http://localhost:4173", "http://localhost:5174", "http://192.168.0.189:5174","http://192.168.0.189:5173"],
    credentials: true
}))

app.use("/api/v1/item", itemRoute);
app.use("/api/v1/inventory", inventoryItemRoute);
app.use("/api/v1/inventory", holdingItemRoute);
app.use("/api/v1/inventory", currentItemRoute);
app.use("/api/v1/company",CompanyRouter)
app.use("/api/v1/purchase-order",PurchaseOrderRouter)
app.use("/api/v1/units",unitRouter)
app.use("/api/v1/service",ServiceRouter)
app.use("/api/v1/ladger",LagderRouter)
app.use("/api/v1/perfoma",PerfomaRouter)
app.use("/api/v1/service-perfoma",ServicePerformaRouter)
app.use("/api/v1",AnalyticRouter)
app.use("/api/v1/po",mnsPurchaseOrderNew)
// after new requirement on 10-04-2025
app.use("/api/v1/group", groupRouter); // complete from frontend
app.use("/api/v1/bank", bankRouter); // complete from frontend
app.use("/api/v1/service-account", serviceAccountRouter); //complete from backend
app.use("/api/v1/deposit-credit", depositCreditRouter); // complete from frontend
app.use("/api/v1/withdraw", withdrawRouter); // complete from frontend
app.use("/api/v1/imprest-fund", imprestFundRouter); // complete from frontend
app.use("/api/v1/expense", expenseRouter); // complete from frontend
app.use("/api/v1/purchase-window", purchaseWindowRouter); // complete from frontend
app.use("/api/v1/purchase-account", purchaseAccountRouter); // complete from frontend
app.use("/api/v1/dummy-slip", dummySlipRouter); // complete from frontend
app.use("/api/v1/notes", notesRouter); // complete from frontend
app.use('/api/v1/reports', reportRoutes);
app.use('/api/money-transfers', moneyTransferRoutes); // complete from frontend

app.use("/api/v1/master-ledger", masterLedgerRoutes);
app.use("/api/v1", allLedgerRoute);
app.use("/api/v1/profit-loss", profitLossRoutes);
app.use("/api/v1/credit-debit-notes", creditDebitNotesRoutes);


// for snigdha 

app.use("/s/api/v1/item", snigdhaitemRoute);
app.use("/s/api/v1/inventory", snigdhainventoryItemRoute);
app.use("/s/api/v1/inventory", snigdhaholdingItemRoute);
app.use("/s/api/v1/inventory", snigdhacurrentItemRoute);
app.use("/s/api/v1/company", snigdhaCompanyRouter);
app.use("/s/api/v1/purchase-order", snigdhaPurchaseOrderRouter);
app.use("/s/api/v1/units", snigdhaunitRouter);
app.use("/s/api/v1/ladger", snigdhaLagderRouter);
app.use("/s/api/v1", snigdhaAnalyticRouter);
app.use("/s/api/v1", snigdhaBulkRouter);
app.use("/s/api/v1/po", snigdhaPurchaseOrderNew);

// after new requirement on 10-04-2025
app.use("/s/api/v1/bank", snigdhaBankRouter);
app.use("/s/api/v1/deposit-credit", snigdhaDepositCreditRouter);
app.use("/s/api/v1/withdraw", snigdhaWithdrawRouter);
app.use("/s/api/v1/imprest-fund", snigdhaImprestFundRouter);
app.use("/s/api/v1/expense", snigdhaExpenseRouter);
app.use("/s/api/v1/purchase-window", snigdhaPurchaseWindowRouter);
app.use("/s/api/v1/purchase-account", snigdhaPurchaseAccountRouter); // Added Snigdha purchase account route
app.use("/s/api/v1/notes", snigdhaNotesRoutes);
app.use('/s/api/money-transfers', snigdhaMoneyTransferRoutes); // Added Snigdha money transfer routes
app.use('/s/api/v1/reports', snigdhaReportRoutes); // Added Snigdha report routes


app.use("/s/api/v1/master-ledger", snigdhaMasterLedgerRoutes);
app.use("/s/api/v1", snigdhaAllLedgerRoute);
app.use("/s/api/v1/profit-loss", snigdhaProfitLossRoutes);
app.use("/s/api/v1/proforma", snigdhaProductProformaRoutes);
app.use("/s/api/v1/service-invoice", snigdhaServiceInvoiceRoutes);
app.use("/s/api/v1/service-ledger", snigdhaServiceLedgerRoutes);
app.use("/s/api/v1/credit-debit-notes", snigdhaCreditDebitNotesRoutes);

// 17/10/2025
app.use("/s/api/v1/orders",newOrderRouter);


//* my routes arnab-golder 19 march
app.use("/api/v2/invoice",invoiceRouter);
//* my routes mns invoice
app.use("/api/v3/mns/invoices", mnsInvoiceRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1",bulkRouter);
// app.use("/api/v1",bulkRouter)



app.get("/error", (req, res, next) => {
    // res.send("error");
    return next(new ErrorHandler("This is a custom error!", 400));
});
app.get("/home", (req, res) => {
    res.send( "MNS server is running ");
});

// app.use("*", (req, res) => {
//     ResponseHandler.error(res, "Page not found for no route avaible or *", 404);
// });



app.use(errorMiddleware);



export default app;
