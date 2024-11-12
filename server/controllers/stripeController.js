const asyncHandler = require("express-async-handler");
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

// const processPayment = asyncHandler(async (req, res) => {
//   const { amount, paymentMethodId } = req.body;
//   console.log("Payment Method ID:", paymentMethodId);
//   console.log("Amount:", amount);
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       payment_method: paymentMethodId,
//       confirm: true, // Automatically confirms the payment
//       return_url: "https://localhost:3000/homepage",
//     });
//     console.log("Payment Intent:", paymentIntent);
//     res.json({ clientSecret: paymentIntent.client_secret }); // Return clientSecret
//   } catch (error) {
//     //console.error("Stripe error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

const processPayment = asyncHandler(async (req, res) => {
  const { amount } = req.body; // No need for paymentMethodId here

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true }, // Simplifies payment method handling
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { processPayment };
