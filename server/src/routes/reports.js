const express = require("express");

const {
  getDashboard,
  getSalesReport,
} = require("../controllers/reportController");

const router = express.Router();

// Dashboard
router.get("/dashboard", getDashboard);

// Sales Report
router.get("/sales", getSalesReport);

module.exports = router;
