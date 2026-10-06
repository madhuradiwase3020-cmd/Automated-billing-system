const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customers");
const billingRoutes = require("./routes/billing");
const paymentRoutes = require("./routes/payments");
const inventoryRoutes = require("./routes/inventory");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoice");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "Automated Billing System",
  });
});

// Product APIs
app.use("/api/products", productRoutes);

// Customer APIs
app.use("/api/customers", customerRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

module.exports = app;