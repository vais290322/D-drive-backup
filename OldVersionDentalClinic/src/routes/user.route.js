const express = require("express");
const { register, login, logout, forgetPassword, resetPassword } = require("../controllers/user.contoller.js");
const isAuthenticated = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.route('/signin').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:id/:token').post(resetPassword);

module.exports = router;
