import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  getProfileController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);

authRouter.post("/logout", authMiddleware, logoutController);

authRouter.get("/profile", authMiddleware, getProfileController);

export default authRouter;
