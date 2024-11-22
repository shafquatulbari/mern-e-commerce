const express = require("express");
const {
  getOrders,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getCanceledOrdersByUser,
  getAllCanceledOrders,
} = require("../controllers/cartController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/all", protect, admin, getAllOrders);
router.delete("/:orderId", protect, cancelOrder);
router.put("/:orderId/status", protect, admin, updateOrderStatus);

router.get("/canceled", protect, getCanceledOrdersByUser);
router.get("/canceled/all", protect, admin, getAllCanceledOrders);

module.exports = router;
