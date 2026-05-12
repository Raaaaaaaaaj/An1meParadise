import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildInvoiceHtml, generatePdfBufferFromHtml } from "../controllers/payment.controller.js";

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const metadata = {
    buyer: {
      name: "Test Buyer",
      email: "test@example.com",
      phone: "9876543210",
    },
    items: [
      { title: "Sample Figure", quantity: 1, price: 19900, sku: "FIG-001" },
    ],
    total: 19900,
  };

  const order_id = `TEST_ORDER_${Date.now()}`;
  const payment_id = `TEST_PAY_${Date.now()}`;

  // Generate HTML
  const html = buildInvoiceHtml({ order_id, payment_id, metadata });
  const outHtml = path.join(__dirname, "../out_invoice.html");
  fs.writeFileSync(outHtml, html, "utf8");
  console.log("Wrote HTML invoice to:", outHtml);

  // Generate PDF
  try {
    const pdfBuffer = await generatePdfBufferFromHtml({ order_id, payment_id, metadata });
    const outPdf = path.join(__dirname, "../out_invoice.pdf");
    fs.writeFileSync(outPdf, pdfBuffer);
    console.log("Wrote PDF invoice to:", outPdf);
  } catch (err) {
    console.error("Failed to generate PDF preview:", err);
  }
}

run();
