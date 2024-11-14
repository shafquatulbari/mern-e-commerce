const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
  getCategoryById,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(protect, getCategories)
  .post(protect, admin, createCategory);

// Protect the route with the protect middleware
router
  .route("/:id")
  .get(protect, getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

router.route("/:id/products").get(protect, getProductsByCategory);
module.exports = router;
