const mongoose = require("mongoose");

const manufacturerSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // Add image field to store image URL
  },
  { timestamps: true }
);

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);
module.exports = Manufacturer;
