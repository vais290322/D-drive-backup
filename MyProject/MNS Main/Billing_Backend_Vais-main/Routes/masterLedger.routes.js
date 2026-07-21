import express from "express";
import { 
  getMasterLedgerReport,
  getSalesLedgerReport,
  getServicesLedgerReport,
  getPurchasesLedgerReport
} from "../Controllers/masterLedger.controller.js";

const router = express.Router();

// Master ledger routes
router.get("/master", getMasterLedgerReport);
router.get("/sales", getSalesLedgerReport);
router.get("/services", getServicesLedgerReport);
router.get("/purchases", getPurchasesLedgerReport);

export default router;
