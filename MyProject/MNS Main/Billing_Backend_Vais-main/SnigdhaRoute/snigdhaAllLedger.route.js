import express from "express";
import { getAllCustomersAndVendorsLedger, getAllLedgerDetails } from "../SnigdhaControllers/snigdhaAllLedger.controller.js";

const router = express.Router();

// GET /snigdha-all-ledger?customerName=...
router.get("/snigdha-all-ledger", getAllLedgerDetails);

router.get("/snigdha-all-ledger/all", getAllCustomersAndVendorsLedger);

export default router;