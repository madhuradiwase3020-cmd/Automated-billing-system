const express = require("express");

const {
  getInventory,
  updateStock,
  getLowStockProducts,
} = require("../controllers/inventoryController");

const router = express.Router();

// Get complete inventory
router.get("/", getInventory);

// Get low stock products
router.get("/low-stock", getLowStockProducts);

// Update product stock
router.put("/:id", updateStock);

module.exports = router;