import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createHSN, fetchHSN } from "./hsn.controller.js";

const hsnRouter = Router();

hsnRouter.route("/").post(createHSN).get(fetchHSN);

export default hsnRouter;
