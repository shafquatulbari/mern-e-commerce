const asyncHandler = require("express-async-handler");
const Manufacturer = require("../models/Manufacturer");
const Product = require("../models/Product");

// Get all manufacturers
const getManufacturers = asyncHandler(async (req, res) => {
  const manufacturers = await Manufacturer.find({});
  res.json(manufacturers);
});

// Create a new manufacturer
const createManufacturer = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const manufacturerExists = await Manufacturer.findOne({ name });

  if (manufacturerExists) {
    res.status(400);
    throw new Error("Manufacturer already exists");
  }

  const manufacturer = new Manufacturer({
    name,
    description,
    image,
  });
  const createdManufacturer = await manufacturer.save();
  res.status(201).json(createdManufacturer);
});

// Update manufacturer
const updateManufacturer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  const manufacturer = await Manufacturer.findById(id);

  if (manufacturer) {
    manufacturer.name = name || manufacturer.name;
    manufacturer.description = description || manufacturer.description;
    manufacturer.image = image || manufacturer.image;

    const updatedManufacturer = await manufacturer.save();
    res.json(updatedManufacturer);
  } else {
    res.status(404);
    throw new Error("Manufacturer not found");
  }
});

// Delete manufacturer
const deleteManufacturer = asyncHandler(async (req, res) => {
  const manufacturer = await Manufacturer.findById(req.params.id);
  if (manufacturer) {
    await manufacturer.deleteOne();
    res.json({ message: "Manufacturer removed" });
  } else {
    res.status(404);
    throw new Error("Manufacturer not found");
  }
});

// Get products by manufacturer
const getProductsByManufacturer = asyncHandler(async (req, res) => {
  // Find the manufacturer by ID
  const manufacturer = await Manufacturer.findById(req.params.id);

  if (manufacturer) {
    // Use the manufacturer's ObjectId (_id) to find products
    const products = await Product.find({
      manufacturer: manufacturer._id,
    }).populate("manufacturer", "name");
    res.json(products);
  } else {
    res.status(404).json({ message: "Manufacturer not found" });
  }
});

//Get manufacturer by ID
const getManufacturerById = asyncHandler(async (req, res) => {
  const manufacturer = await Manufacturer.findById(req.params.id);
  if (manufacturer) {
    res.json(manufacturer);
  } else {
    res.status(404);
    throw new Error("Manufacturer not found");
  }
});

module.exports = {
  getManufacturers,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getProductsByManufacturer,
  getManufacturerById,
};
