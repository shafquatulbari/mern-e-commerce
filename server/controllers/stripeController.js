const asyncHandler = require("express-async-handler");
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

const processPayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true, // Automatically confirms the payment
      return_url: "https://www.google.com", // Your return URL
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { processPayment };
