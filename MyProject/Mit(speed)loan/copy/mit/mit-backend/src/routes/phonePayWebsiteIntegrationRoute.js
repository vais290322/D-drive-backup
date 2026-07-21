const express=require("express");
const { createPayment,checkOrderStatus } = require("../controllers/phonePayWebsiteIntegratioin");
const router=express.Router();


router.post("/createPayment/:loanId",createPayment);
router.get("/checkOrderStatus/:merchantOrderId",checkOrderStatus);

module.exports=router;