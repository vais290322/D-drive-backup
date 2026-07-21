import express from "express";
import { getAllMnsLedgerDetails } from "../Controllers/mnsAllLedger.controller.js";

const router = express.Router();

router.get("/mns-all-ledger", getAllMnsLedgerDetails);

export default router;