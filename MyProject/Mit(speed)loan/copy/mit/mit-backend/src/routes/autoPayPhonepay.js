const express=require("express");
const router=express.Router();
const {autoPaySetup,checkSetupOrderStatus,checkSubscriptionStatus,notifyRedemption, checkRedemptionOrderStatus, redemptionExecute, cancelSubscription, checkOutOrderCompleteWebhook,subscriptionRedemptionTransactionCompletedWebhook,subscriptionStateChangeWebhook}=require("../controllers/autoPayPhonepay");

router.post("/autoPaySetup/:loanId",autoPaySetup);
router.get("/checkSetupOrderStatus/:loanId",checkSetupOrderStatus);
router.get("/checkSubscriptionStatus/:loanId",checkSubscriptionStatus);
router.post("/notify-redemption/:loanId",notifyRedemption);
router.get("/get-redemption-status/:loanId",checkRedemptionOrderStatus);
router.post("/execute-redemption/:loanId",redemptionExecute);
router.post("/cancel-subscription/:loanId",cancelSubscription);
router.post("/check-out-order-complete-webhook",checkOutOrderCompleteWebhook);
router.post("/subscription-redemption-transaction-completed-webhook",subscriptionRedemptionTransactionCompletedWebhook);
router.post("/subscription-state-change-webhook",subscriptionStateChangeWebhook);


module.exports=router;