const express = require("express");

const {
  createBill,
  getBills,
  getBill,
} = require("../controllers/billingController");

const router = express.Router();

// Create Bill
router.post("/", createBill);

// Get All Bills
router.get("/", getBills);

// Get Single Bill
router.get("/:id", getBill);

module.exports = router;