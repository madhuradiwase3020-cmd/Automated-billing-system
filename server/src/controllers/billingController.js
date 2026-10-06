const Bill = require("../models/Bill");
const Product = require("../models/Product");

// Create Bill
const createBill = async (req, res) => {
  try {
    const {
      customer_id,
      items,
      payment_status = "Pending",
    } = req.body;

    if (!customer_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and at least one product are required",
      });
    }

    let subtotal = 0;
    let total_gst = 0;
    const billItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product_id}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.product_name}`,
        });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}`,
        });
      }

      const itemSubtotal = product.price * quantity;
      const gstAmount =
        (itemSubtotal * product.gst_rate) / 100;

      const itemTotal = itemSubtotal + gstAmount;

      subtotal += itemSubtotal;
      total_gst += gstAmount;

      billItems.push({
        product_id: product._id,
        product_name: product.product_name,
        quantity,
        price: product.price,
        gst_rate: product.gst_rate,
        gst_amount: gstAmount,
        total: itemTotal,
      });

      // Reduce stock
      product.stock_quantity -= quantity;
      await product.save();
    }

    const grand_total = subtotal + total_gst;

    const invoice_number =
      "INV-" +
      Date.now();

    const bill = await Bill.create({
      invoice_number,
      customer_id,
      items: billItems,
      subtotal,
      total_gst,
      grand_total,
      payment_status,
    });

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create bill",
      error: error.message,
    });
  }
};

// Get All Bills
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("customer_id", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};

// Get Single Bill
const getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("customer_id", "name phone email");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: true,
      bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
      error: error.message,
    });
  }
};

module.exports = {
  createBill,
  getBills,
  getBill,
};