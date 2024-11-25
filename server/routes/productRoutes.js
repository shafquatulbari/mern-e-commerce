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
  searchProductsOCR,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/search").get(protect, searchProducts);
router.route("/searchOCR").get(protect, searchProductsOCR);

router.route("/").get(protect, getProducts).post(protect, admin, addProduct);
router
  .route("/:id")
  .get(protect, getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

//Add review routes
router.post("/:productId/reviews", protect, addReview); // Add review
router.delete("/:productId/reviews/:reviewIndex", protect, deleteReview); // Delete review

module.exports = router;
