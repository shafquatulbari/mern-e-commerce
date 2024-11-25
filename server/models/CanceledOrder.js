const mongoose = require("mongoose");

const canceledOrderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Canceled" },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true },
    paymentMethod: { type: String, enum: ["card", "cash"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CanceledOrder = mongoose.model("CanceledOrder", canceledOrderSchema);
module.exports = CanceledOrder;
