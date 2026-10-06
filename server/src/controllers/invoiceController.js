const PDFDocument = require("pdfkit");
const Bill = require("../models/Bill");

const generateInvoice = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("customer_id", "name phone email address");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${bill.invoice_number}.pdf`
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(24)
      .text("AUTOMATED BILLING SYSTEM", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text("INVOICE", {
        align: "center",
      });

    doc.moveDown(2);

    // Invoice Information
    doc.fontSize(11);

    doc.text(`Invoice Number: ${bill.invoice_number}`);
    doc.text(
      `Date: ${new Date(bill.createdAt).toLocaleDateString()}`
    );

    doc.moveDown();

    // Customer Information
    doc.fontSize(14).text("Customer Details");

    doc.fontSize(11);

    doc.text(`Name: ${bill.customer_id.name}`);
    doc.text(`Phone: ${bill.customer_id.phone || "N/A"}`);
    doc.text(`Email: ${bill.customer_id.email || "N/A"}`);
    doc.text(`Address: ${bill.customer_id.address || "N/A"}`);

    doc.moveDown(2);

    // Table Header
    doc.fontSize(12);

    doc.text(
      "Product                    Qty        Price        GST        Total"
    );

    doc.moveDown();

    // Items
    bill.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.product_name}                    ${item.quantity}        ₹${item.price.toFixed(
            2
          )}        ₹${item.gst_amount.toFixed(
            2
          )}        ₹${item.total.toFixed(2)}`
        );

      doc.moveDown(0.5);
    });

    doc.moveDown();

    // Summary
    doc.fontSize(12);

    doc.text(`Subtotal: ₹${bill.subtotal.toFixed(2)}`);

    doc.text(`Total GST: ₹${bill.total_gst.toFixed(2)}`);

    doc.fontSize(14).text(
      `Grand Total: ₹${bill.grand_total.toFixed(2)}`
    );

    doc.moveDown();

    doc.fontSize(11).text(
      `Payment Status: ${bill.payment_status}`
    );

    doc.moveDown(3);

    doc
      .fontSize(10)
      .text("Thank you for your business!", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message,
    });
  }
};

module.exports = {
  generateInvoice,
};