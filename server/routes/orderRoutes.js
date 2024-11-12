const express = require("express");
const {
  getOrders,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/cartController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/all", protect, admin, getAllOrders);
router.delete("/:orderId", protect, cancelOrder);
router.put("/:orderId/status", protect, admin, updateOrderStatus);

module.exports = router;
