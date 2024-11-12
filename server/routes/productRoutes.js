const express = require("express");
const {
  getProductById,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  addReview,
  deleteReview,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getProducts).post(protect, admin, addProduct);
router
  .route("/:id")
  .get(protect, getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route("/search").get(protect, searchProducts);

//Add review routes
router.post("/:productId/reviews", protect, addReview); // Add review
router.delete("/:productId/reviews/:reviewIndex", protect, deleteReview); // Delete review

module.exports = router;
