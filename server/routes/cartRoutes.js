const express = require("express");
const {
  addToCart,
  checkout,
  getOrders,
  cancelOrder,
  updateOrderStatus,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addToCart);
router.route("/:productId").delete(protect, removeFromCart);
router.post("/checkout", protect, checkout);
router.get("/", protect, getOrders);
router.delete("/:orderId", protect, cancelOrder);
router.put("/:orderId/status", protect, admin, updateOrderStatus);

module.exports = router;
