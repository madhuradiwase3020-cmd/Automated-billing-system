const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    payment_method: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank Transfer"],
      required: true,
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },

    transaction_id: {
      type: String,
      trim: true,
    },

    payment_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);