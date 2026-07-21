import express from "express";
import { 
  getSnigdhaMasterLedgerReport,
  getSnigdhaSalesLedgerReport,
  getSnigdhaPurchasesLedgerReport,
  getSnigdhaServiceLedgerReport
} from "../SnigdhaControllers/snigdhaMesterLedger.controller.js";

const router = express.Router();

// Snigdha Master ledger routes
router.get("/master", getSnigdhaMasterLedgerReport);
router.get("/sales", getSnigdhaSalesLedgerReport);
router.get("/purchases", getSnigdhaPurchasesLedgerReport);
router.get("/services", getSnigdhaServiceLedgerReport);

export default router;