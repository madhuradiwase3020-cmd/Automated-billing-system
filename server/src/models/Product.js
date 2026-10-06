const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    gst_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock_quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    low_stock_limit: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);