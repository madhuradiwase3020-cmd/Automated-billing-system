const Product = require("../models/Product");

// Get Inventory
const getInventory = async (req, res) => {
  try {
    const products = await Product.find()
      .select(
        "product_name barcode category price stock_quantity low_stock_limit"
      )
      .sort({ product_name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      inventory: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

// Update Stock
const updateStock = async (req, res) => {
  try {
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined || stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stock quantity is required",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock_quantity },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update stock",
      error: error.message,
    });
  }
};

// Get Low Stock Products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: ["$stock_quantity", "$low_stock_limit"],
      },
    }).sort({ stock_quantity: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch low stock products",
      error: error.message,
    });
  }
};

module.exports = {
  getInventory,
  updateStock,
  getLowStockProducts,
};