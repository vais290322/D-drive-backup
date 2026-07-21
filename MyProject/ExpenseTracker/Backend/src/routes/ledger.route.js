import { Router } from "express";
import {
  getLedger,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/ledger.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all ledger endpoints
router.use(verifyJWT);

router.route("/")
  .get(getLedger)
  .post(addTransaction);

router.route("/day/:dayId/transaction/:subItemId")
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
