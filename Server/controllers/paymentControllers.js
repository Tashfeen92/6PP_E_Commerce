// Imports
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Order Payment Processing
const processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "pkr",
    metadata: { company: "E-commerce" },
  });
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

// Send Stripe Key To Front End
const sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

module.exports = { processPayment, sendStripeApiKey };
