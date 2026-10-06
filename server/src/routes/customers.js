const express = require("express");

const {
  addCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

// GET all customers
router.get("/", getCustomers);

// GET single customer
router.get("/:id", getCustomer);

// POST add customer
router.post("/", addCustomer);

// PUT update customer
router.put("/:id", updateCustomer);

// DELETE customer
router.delete("/:id", deleteCustomer);

module.exports = router;