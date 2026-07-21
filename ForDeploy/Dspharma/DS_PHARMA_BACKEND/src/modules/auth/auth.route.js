import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getProfileController,
  loginController,
  logoutController,
} from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.get("/profile", authMiddleware, getProfileController);

export default authRouter;
