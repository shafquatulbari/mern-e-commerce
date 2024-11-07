const express = require("express");
const { processPayment } = require("../controllers/stripeController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/payment", protect, processPayment);

module.exports = router;
