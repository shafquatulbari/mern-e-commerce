const express = require("express");
const {
  getManufacturers,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getProductsByManufacturer,
  getManufacturerById,
} = require("../controllers/manufacturerController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(protect, getManufacturers)
  .post(protect, admin, createManufacturer);

// Protect the route with the protect middleware
router
  .route("/:id")
  .get(protect, getManufacturerById)
  .put(protect, admin, updateManufacturer)
  .delete(protect, admin, deleteManufacturer);

router.route("/:id/products").get(protect, getProductsByManufacturer);
module.exports = router;
