import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
// router.post("/logout", logout);

export default router;