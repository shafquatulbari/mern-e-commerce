const express = require("express");
const {
  addToCart,
  checkout,
  getOrders,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/cartController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add-to-cart", protect, addToCart); // Frontend will handle this
router.post("/checkout", protect, checkout);
router.get("/", protect, getOrders);
router.delete("/:orderId", protect, cancelOrder);
router.put("/:orderId/status", protect, admin, updateOrderStatus);

module.exports = router;
