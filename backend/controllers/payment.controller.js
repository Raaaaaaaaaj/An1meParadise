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
          html: buildOrderEmailHtml({
            role: "owner",
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            metadata,
          }),
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
            html: buildOrderEmailHtml({
              role: "buyer",
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              metadata,
            }),
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
  const total = (metadata && metadata.total) || (metadata && metadata.amount) || 0;

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  const finished = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));
  });

  // Logo / Header
  doc.fillColor("#000000").fontSize(24).font("Helvetica-Bold").text("AN1MEPARADISE", { characterSpacing: 2 });
  doc.fontSize(8).font("Helvetica").text("PREMIUM COLLECTIBLES", { characterSpacing: 1 });
  doc.moveDown(2);

  // Horizontal Rule
  doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(2).strokeColor("#000000").stroke();
  doc.moveDown(1.5);

  // Order Info
  const topY = doc.y;
  doc.fontSize(10).fillColor("#94a3b8").text("ORDER ID", 50, topY);
  doc.fillColor("#000000").fontSize(12).font("Helvetica-Bold").text(`#${order_id}`, 50, topY + 15);

  doc.fontSize(10).fillColor("#94a3b8").text("DATE", 350, topY);
  doc.fillColor("#000000").fontSize(12).font("Helvetica-Bold").text(new Date().toLocaleDateString(), 350, topY + 15);
  doc.moveDown(3);

  // Billing Info
  doc.fontSize(10).fillColor("#94a3b8").font("Helvetica").text("BILL TO");
  doc.fontSize(12).fillColor("#000000").font("Helvetica-Bold").text(buyer.name || buyer.fullName || "Valued Customer");
  doc.fontSize(10).font("Helvetica").fillColor("#64748b").text(buyer.email || "");
  doc.moveDown(2);

  // Table Header
  const tableTop = doc.y;
  doc.fillColor("#000000").font("Helvetica-Bold").fontSize(10);
  doc.text("ITEM", 50, tableTop);
  doc.text("QTY", 360, tableTop);
  doc.text("PRICE", 470, tableTop, { align: "right" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor("#000000").stroke();
  doc.moveDown(1);

  // Items
  doc.font("Helvetica").fontSize(10);
  for (const it of items) {
    const title = it.title || it.product?.prod_title || it.name || "Item";
    const qty = it.quantity || it.qty || 1;
    const price = ((it.price || it.product?.prod_actualPrice || 0) / 100).toFixed(2);
    
    doc.fillColor("#000000").text(title, 50, doc.y, { width: 280 });
    const currentY = doc.y;
    doc.text(String(qty), 360, currentY - 10);
    doc.text(`INR ${price}`, 470, currentY - 10, { align: "right" });
    doc.moveDown(1);
  }

  // Totals
  doc.moveDown(2);
  const shipping = total >= 99900 ? 0 : 99;
  const grandTotal = (total / 100) + (shipping / 100);

  const summaryY = doc.y;
  doc.fontSize(10).fillColor("#64748b").text("Subtotal:", 350, summaryY);
  doc.fillColor("#000000").text(`INR ${(total/100).toFixed(2)}`, 470, summaryY, { align: "right" });
  
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#64748b").text("Shipping:", 350, doc.y);
  doc.fillColor("#000000").text(shipping === 0 ? "FREE" : `INR ${(shipping/100).toFixed(2)}`, 470, doc.y, { align: "right" });

  doc.moveDown(1);
  doc.fontSize(14).font("Helvetica-Bold").text("Total:", 350, doc.y);
  doc.text(`INR ${grandTotal.toFixed(2)}`, 470, doc.y, { align: "right" });

  doc.end();
  return await finished;
}

export function buildInvoiceHtml({ order_id, payment_id, metadata }) {
  const buyer = (metadata && metadata.buyer) || {};
  const items = (metadata && metadata.items) || [];
  const total = (metadata && metadata.total) || (metadata && metadata.amount) || 0;
  
  const itemsRows = items.map((it) => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-weight: 600; font-size: 15px;">${escapeHtml(it.title || it.name || "Item")}</div>
        <div style="font-size: 12px; color: #94a3b8;">Ref: ${escapeHtml(payment_id.slice(-6))}</div>
      </td>
      <td style="padding: 20px 0; border-bottom: 1px solid #f1f5f9; text-align: center;">${it.quantity || 1}</td>
      <td style="padding: 20px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">₹${((it.price || 0) / 100).toFixed(2)}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Poppins', sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 40px; }
        .invoice-box { max-width: 850px; margin: auto; border: 1px solid #f1f5f9; padding: 50px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.02); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 30px; margin-bottom: 40px; }
        .brand { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .invoice-label { font-size: 40px; font-weight: 700; margin: 0; line-height: 1; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-bottom: 40px; }
        .meta-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11px; text-transform: uppercase; color: #94a3b8; padding-bottom: 15px; border-bottom: 1px solid #0f172a; }
        .total-row { display: flex; justify-content: flex-end; margin-top: 30px; }
        .total-card { background: #0f172a; color: #ffffff; padding: 30px; border-radius: 16px; width: 250px; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="brand">An1meParadise</div>
            <div style="font-size: 13px; color: #64748b;">Official Purchase Document</div>
          </div>
          <h1 class="invoice-label">INVOICE</h1>
        </div>

        <div class="grid" style="display: flex; justify-content: space-between;">
          <div>
            <div class="meta-label">Billed To</div>
            <div style="font-size: 18px; font-weight: 600;">${escapeHtml(buyer.name || buyer.fullName || "Customer")}</div>
            <div style="color: #64748b; font-size: 14px;">${escapeHtml(buyer.email || "-")}</div>
            <div style="color: #64748b; font-size: 14px; margin-top: 4px; max-width: 250px;">${escapeHtml(formatAddress(metadata?.address))}</div>
          </div>
          <div style="text-align: right;">
            <div class="meta-label">Invoice Details</div>
            <div style="font-size: 14px; font-weight: 600;">Order: #${order_id.slice(-8)}</div>
            <div style="font-size: 14px; color: #64748b;">Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="total-row">
          <div class="total-card">
            <div style="display: flex; justify-content: space-between; font-size: 12px; opacity: 0.8; margin-bottom: 10px;">
              <span>Subtotal</span>
              <span>₹${(total / 100).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; opacity: 0.8; margin-bottom: 15px;">
              <span>Shipping</span>
              <span>${total >= 99900 ? "FREE" : "₹99.00"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
              <span>Total</span>
              <span>₹${(total / 100 + (total >= 99900 ? 0 : 99)).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center;">
          This is a computer generated document. No signature required.
        </div>
      </div>
    </body>
    </html>
  `;
}

// Build a short, premium-looking order email (used for owner and buyer)
export function buildOrderEmailHtml({ role, order_id, payment_id, metadata }) {
  const buyer = (metadata && metadata.buyer) || {};
  const items = (metadata && metadata.items) || [];
  
  const itemsSummary = items.slice(0, 3).map((it) => `
    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 500; color: #1e293b;">${escapeHtml(it.title || it.product?.prod_title || it.name || "Item")} <small style="color: #64748b; font-weight: 400;">x${it.quantity || 1}</small></span>
      <span style="font-weight: 600; color: #0f172a;">₹${((it.price || 0) / 100).toFixed(2)}</span>
    </div>
  `).join("");

  const title = role === "owner" ? "New Order Received" : "Order Confirmed";
  const subtitle = role === "owner" 
    ? `A new transaction has been processed for ${escapeHtml(buyer.name || "a customer")}.` 
    : `Hi ${escapeHtml(buyer.name || "there")}, your order is being prepared.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .wrapper { width: 100%; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header-gradient { background: linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%); padding: 40px 30px; text-align: center; }
        .pill { background: #ffffff; border: 1px solid #bae6fd; color: #0284c7; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 16px; }
        .content { padding: 0 40px 40px 40px; }
        .order-card { background: #f1f5f9; border-radius: 12px; padding: 20px; margin-top: 24px; }
        .btn { display: inline-block; background: #0f172a; color: #ffffff !important; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 20px; }
        .footer { padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header-gradient">
            <span class="pill">${role === 'owner' ? 'Merchant Alert' : 'Order Success'}</span>
            <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 700;">${title}</h1>
            <p style="color: #64748b; font-size: 15px; margin-top: 8px;">${subtitle}</p>
          </div>
          
          <div class="content">
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 12px;">Order Summary</h3>
            ${itemsSummary}
            
            <div class="order-card">
               <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
                  <span style="color: #64748b;">Order ID</span>
                  <span style="color: #0f172a; font-weight: 600;">#${order_id.split('_')[1] || order_id}</span>
               </div>
               <div style="text-align: center; margin-top: 15px;">
                  <a href="https://www.an1meparadise.com" class="btn">View Full Details</a>
               </div>
            </div>
          </div>

          <div class="footer">
            <div style="font-weight: 700; color: #1e293b; margin-bottom: 4px;">An1meParadise</div>
            <div>Modern Collectibles • Premium Quality</div>
          </div>
        </div>
      </div>
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
