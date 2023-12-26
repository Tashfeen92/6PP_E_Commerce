const express = require("express");
const router = express.Router();
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentControllers");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapikey").get(sendStripeApiKey); // Removed isAuthenticatedUser Middleware by resolve issue of not getting stripe Api Key when Logged Out.

module.exports = router;

