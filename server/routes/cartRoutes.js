const express = require("express");
const {
  addToCart,
  checkout,
  getCart,
  removeFromCart,
  updateItemQuantity,
} = require("../controllers/cartController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addToCart);
router.route("/:productId").delete(protect, removeFromCart);
router.route("/:productId").put(protect, updateItemQuantity);

router.post("/checkout", protect, checkout);

module.exports = router;
