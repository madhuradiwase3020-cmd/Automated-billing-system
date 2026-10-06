const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Bill = require("../models/Bill");

// Dashboard Summary
const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalCustomers = await Customer.countDocuments();

    const totalBills = await Bill.countDocuments();

    const paidBills = await Bill.countDocuments({
      payment_status: "Paid",
    });

    const pendingBills = await Bill.countDocuments({
      payment_status: "Pending",
    });

    const partialBills = await Bill.countDocuments({
      payment_status: "Partial",
    });

    const revenueResult = await Bill.aggregate([
      {
        $match: {
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$grand_total",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ["$stock_quantity", "$low_stock_limit"],
      },
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalCustomers,
        totalBills,
        paidBills,
        pendingBills,
        partialBills,
        totalRevenue,
        lowStockProducts: lowStockProducts.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

// Sales Report
const getSalesReport = async (req, res) => {
  try {
    const sales = await Bill.find({
      payment_status: "Paid",
    })
      .populate("customer_id", "name phone")
      .sort({ createdAt: -1 });

    const totalSales = sales.reduce(
      (sum, bill) => sum + bill.grand_total,
      0
    );

    res.status(200).json({
      success: true,
      count: sales.length,
      totalSales,
      sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate sales report",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getSalesReport,
};