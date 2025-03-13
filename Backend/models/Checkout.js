const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity : {
      type: Number,
      required: true,
    },
    size: String,
    color: String,
  },
  { _id: false } 
);

const checkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkoutItems: [checkoutItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
  },
  ispaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    default: "pending",
  },
  paymentDetails: {
    // store payment-related details (transaction ID, PayPal response, etc.)
    type: mongoose.Schema.Types.Mixed,
  },
  isFinalized: {
    type: Boolean,
    default: false,
  },
  finalizedAt: {
    type: Date,
  },
}, { timestamps: true });

// Fixed the export: changed module.export to module.exports
module.exports = mongoose.model("Checkout", checkoutSchema);
