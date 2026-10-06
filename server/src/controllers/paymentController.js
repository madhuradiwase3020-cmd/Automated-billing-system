const Payment = require("../models/Payment");
const Bill = require("../models/Bill");

// Create Payment
const createPayment = async (req, res) => {
  try {
    const {
      bill_id,
      amount,
      payment_method,
      transaction_id,
    } = req.body;

    if (!bill_id || amount === undefined || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "Bill, amount and payment method are required",
      });
    }

    const bill = await Bill.findById(bill_id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    const payment = await Payment.create({
      bill_id,
      amount,
      payment_method,
      transaction_id,
      payment_status: "Completed",
    });

    // Update bill payment status
    if (amount >= bill.grand_total) {
      bill.payment_status = "Paid";
    } else if (amount > 0) {
      bill.payment_status = "Partial";
    }

    await bill.save();

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message,
    });
  }
};

// Get All Payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("bill_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// Get Single Payment
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("bill_id");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
};