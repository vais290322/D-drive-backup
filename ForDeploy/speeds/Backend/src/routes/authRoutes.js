import { Router } from "express";
import {
  registerUser,
  getAllUsers,
  updateRole,
  login,
  forgotPassword,
  resetPassword,
  logout,
  me,
  updateWallet,
  updateUser,
  userverify,
  alldeliveryboy,
  getAllstaffs,
  deleteUser
} from "../controllers/authController.js";

import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.get("/", requireAuth, isAdmin(["ADMIN", "STAFF"]), getAllUsers);
router.get("/staff", requireAuth, isAdmin(["ADMIN", "STAFF"]), getAllstaffs);
router.put("/:id", requireAuth, isAdmin(["ADMIN"]), updateRole);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me/:id", me);
router.put("/wallet/:id", requireAuth, isAdmin(["USER", "ADMIN"]), updateWallet);
router.put('/update/:id', requireAuth, isAdmin(["USER"]), updateUser);
router.put('/verify/:id', requireAuth, isAdmin(["ADMIN", "STAFF"]), userverify);
router.get('/delivery', requireAuth, isAdmin(["ADMIN", "STAFF"]), alldeliveryboy);
router.delete("/:id", requireAuth, isAdmin(["ADMIN"]),deleteUser);


export default router;
