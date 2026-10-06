const express = require("express");

const {
  generateInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

// Generate Invoice PDF
router.get("/:id/pdf", generateInvoice);

module.exports = router;