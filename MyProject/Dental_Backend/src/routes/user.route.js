import express from "express";
import { register , login, logout,forgetPassword, resetPassword } from "../controllers/user.contoller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route('/signin').post(register);                                              
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:id/:token').post(resetPassword);

export default router;