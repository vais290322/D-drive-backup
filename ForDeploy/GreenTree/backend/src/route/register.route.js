const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getCustomer,
  getUser,
  updateUser,
  otp,
  otpverify,
  registerAdmin,
  getAdminCustomer,
  getallCustomer,
  checkEvents,
  send,
  updateAdmin
} = require("../controller/register.controller.js");
const { staffregister ,getstaffregister ,updatestaffregister} = require("../controller/staff.controller.js");
const { authenticate, authorize } = require("../middleware/authorization.js");


router.post("/register", registerUser);

router.post("/staffregister",authenticate, authorize(["admin"]), staffregister);

router.get("/staffregister", authenticate, authorize(["staff","admin"]), getstaffregister);

router.put("/staffregister", authenticate, authorize(["admin"]), updatestaffregister);

router.post("/adminregister",authenticate, authorize(["admin","staff"]), registerAdmin);

router.get("/getallcustomer", authenticate, authorize(["admin","staff"]), getallCustomer);

router.get("/customer", authenticate, authorize(["admin","staff"]), getCustomer);

router.get("/admincustomer", authenticate, authorize(["admin","staff"]), getAdminCustomer);

router.put("/admincustomerupdate/:id", authenticate, authorize(["admin","staff"]), updateAdmin);




router.post("/login", loginUser);




router.get("/user", authenticate, authorize(["user"]), getUser);

router.put("/userupdate", authenticate, authorize(["user"]), updateUser);

router.post("/forgotpassword", forgotPassword);

router.post("/resetpassword/:id", resetPassword);




router.post("/sentotp", otp);

router.post("/verifyotp", otpverify);




router.get("/check", checkEvents);


router.post("/sendmessage",send)




module.exports = router;
