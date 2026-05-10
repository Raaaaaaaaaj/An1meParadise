import Razorpay from "razorpay";
import crypto from "crypto";
import { savePayment, getPaymentByOrderId } from "../models/payment.model.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit"; 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export async function createOrder(req, res) {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount (in paise) is required" });
    }

    if (amount < 100) {
      return res.status(400).json({ message: "Minimum amount is 100 paise" });
    }

    const options = {
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Create order error:", err);
    if (err.statusCode === 401) {
      return res.status(401).json({ message: "Razorpay authentication failed" });
    }
    return res.status(500).json({ message: "Failed to create order" });
  }
}

// Verify Payment
export async function verifyPayment(req, res) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, metadata } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // persist payment record (best-effort)
      try {
        await savePayment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: "paid",
          metadata: metadata || null,
        });
      } catch (dbErr) {
        console.error("Failed to save payment:", dbErr.message || dbErr);
      }

      // send emails (owner + buyer) with invoice (best-effort)
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

          // Build invoice HTML from metadata (if present)
          const invoiceHtml = buildInvoiceHtml({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            metadata,
          });

          // Generate PDF buffer from metadata (best-effort)
          let pdfBuffer = null;
          try {
            pdfBuffer = await generatePdfBufferFromHtml({ order_id: razorpay_order_id, payment_id: razorpay_payment_id, metadata });
          } catch (pdfErr) {
            console.error("Failed to generate PDF invoice:", pdfErr.message || pdfErr);
          }

          // Owner email (attach PDF when available, otherwise attach HTML)
          const ownerAttachments = pdfBuffer
            ? [
                {
                  filename: `invoice_${razorpay_order_id}.pdf`,
                  content: pdfBuffer,
                  contentType: "application/pdf",
                },
              ]
            : [
                {
                  filename: `invoice_${razorpay_order_id}.html`,
                  content: invoiceHtml,
                  contentType: "text/html",
                },
              ];

          await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: process.env.MAIL_USER,
            subject: `New Order Received — ${razorpay_order_id}`,
            html: `<h3>New order received</h3><p>Order ID: ${razorpay_order_id}</p><p>Payment ID: ${razorpay_payment_id}</p>`,
            attachments: ownerAttachments,
          });

          // Buyer email (if provided in metadata.buyer_email)
          const buyerEmail = metadata && (metadata.buyer_email || metadata.email || (metadata.buyer && metadata.buyer.email));
          if (buyerEmail) {
            const buyerAttachments = pdfBuffer
              ? [
                  {
                    filename: `invoice_${razorpay_order_id}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                  },
                ]
              : [
                  {
                    filename: `invoice_${razorpay_order_id}.html`,
                    content: invoiceHtml,
                    contentType: "text/html",
                  },
                ];

            await transporter.sendMail({
              from: process.env.MAIL_USER,
              to: buyerEmail,
              subject: `Your Order Confirmation — ${razorpay_order_id}`,
              html: `<h3>Thank you for your purchase</h3><p>Order ID: ${razorpay_order_id}</p><p>Payment ID: ${razorpay_payment_id}</p>`,
              attachments: buyerAttachments,
            });
          }
      } catch (mailErr) {
        console.error("Failed to send emails:", mailErr.message || mailErr);
      }

      return res.json({ success: true, message: "Payment verified" });
    }

    return res.status(400).json({ success: false, message: "Signature mismatch" });
  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
}

export async function generatePdfBufferFromHtml({ order_id, payment_id, metadata }) {
  const buyer = (metadata && metadata.buyer) || {};
  const items = (metadata && metadata.items) || [];
  const total = (metadata && metadata.total) || (metadata && metadata.amount) || null;
  const address = (metadata && metadata.address) || null;

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  const finished = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));
  });

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order_id}`);
  doc.text(`Payment ID: ${payment_id}`);
  doc.moveDown();

  doc.fontSize(14).text("Buyer:");
  doc.fontSize(12).text(buyer.name || buyer.fullName || "-");
  doc.text(buyer.email || "-");
  doc.moveDown();

  doc.fontSize(14).text("Address:");
  doc.fontSize(12).text(address ? formatAddress(address) : "-");
  doc.moveDown();

  doc.fontSize(14).text("Items:");
  doc.moveDown(0.5);

  // Table header
  doc.fontSize(12);
  doc.text("Item", { continued: true, width: 300 });
  doc.text("Qty", { continued: true, align: "center", width: 50 });
  doc.text("Price", { align: "right" });
  doc.moveDown(0.5);

  // Items
  for (const it of items) {
    const title = it.title || it.product?.prod_title || it.name || "Item";
    const qty = it.quantity || it.qty || 1;
    const price = (it.price || it.product?.prod_actualPrice || 0) / 100;
    doc.text(title, { continued: true, width: 300 });
    doc.text(String(qty), { continued: true, align: "center", width: 50 });
    doc.text(`₹${price}`, { align: "right" });
  }

  doc.moveDown();
  doc.fontSize(14).text(`Total: ₹${total ? String(total / 100) : "-"}`, { align: "right" });

  doc.end();
  return await finished;
}

export function buildInvoiceHtml({ order_id, payment_id, metadata }) {
  const buyer = (metadata && metadata.buyer) || {};
  const items = (metadata && metadata.items) || [];
  const total = (metadata && metadata.total) || (metadata && metadata.amount) || null;
  const address = (metadata && metadata.address) || null;

  const itemsRows = items
    .map(
      (it) => `<tr><td style="padding:6px;border:1px solid #ddd">${escapeHtml(
        it.title || it.product?.prod_title || it.name || "Item"
      )}</td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(String(
        it.quantity || it.qty || 1
      ))}</td><td style="padding:6px;border:1px solid #ddd">₹${escapeHtml(String(
        (it.price || it.product?.prod_actualPrice || 0) / 100
      ))}</td></tr>`
    )
    .join("\n");

  return `
    <html>
      <body style="font-family:Arial,Helvetica,sans-serif;">
        <h2>Invoice</h2>
        <p><b>Order ID:</b> ${escapeHtml(order_id)}</p>
        <p><b>Payment ID:</b> ${escapeHtml(payment_id)}</p>
        <h3>Buyer</h3>
        <p>${escapeHtml(buyer.name || buyer.fullName || "-")}</p>
        <p>${escapeHtml(buyer.email || "-")}</p>
        <h3>Address</h3>
        <p>${escapeHtml(address ? formatAddress(address) : "-")}</p>
        <h3>Items</h3>
        <table style="border-collapse:collapse;width:100%">
          <thead><tr><th style="padding:6px;border:1px solid #ddd">Item</th><th style="padding:6px;border:1px solid #ddd">Qty</th><th style="padding:6px;border:1px solid #ddd">Price</th></tr></thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        <h3>Total: ₹${total ? String(total / 100) : "-"}</h3>
      </body>
    </html>
  `;
}

function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const parts = [];
  if (addr.house_no) parts.push(addr.house_no);
  if (addr.strt_add) parts.push(addr.strt_add);
  if (addr.landmark) parts.push(addr.landmark);
  if (addr.state) parts.push(addr.state);
  if (addr.pincode) parts.push(addr.pincode);
  return parts.join(", ");
}
