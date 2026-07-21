import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  githubLogin,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/github-login", githubLogin);
router.post("/logout", logout);
router.get("/me", verifyJWT, getMe);


export default router;
 