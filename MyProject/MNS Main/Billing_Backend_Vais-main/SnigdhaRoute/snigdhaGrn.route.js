import express from "express";
import {
  createGrn,
  getGrn,
  listGrns,
  updateGrn,
  deleteGrn,
  damageSummaryByItem
} from "../SnigdhaControllers/snigdhaGrn.controller.js";

const router = express.Router();

router.post("/", createGrn);               // create new GRN
router.get("/", listGrns);                 // list GRNs
router.get("/:id", getGrn);                // get GRN by id
router.put("/:id", updateGrn);             // update GRN
router.delete("/:id", deleteGrn);          // delete GRN
router.get("/summary/item/:item_id", damageSummaryByItem); // detail + totals per item

export default router;