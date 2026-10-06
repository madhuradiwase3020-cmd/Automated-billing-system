const express = require("express");

const {
  createPayment,
  getPayments,
  getPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Payment
router.post("/", createPayment);

// Get All Payments
router.get("/", getPayments);

// Get Single Payment
router.get("/:id", getPayment);

module.exports = router;