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

        const ownerEmail = process.env.OWNER_EMAIL || process.env.MAIL_USER;
        console.log(`Sending owner email to ${ownerEmail} for order ${razorpay_order_id}`);
        const ownerResult = await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: ownerEmail,
          subject: `New Order Received — ${razorpay_order_id}`,
          html: buildOrderEmailHtml({
            role: "owner",
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            metadata,
          }),
          attachments: ownerAttachments,
        });
        console.log("Owner email send result:", ownerResult && (ownerResult.accepted || ownerResult));

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
  // Billing Info
  const buyerPhone = buyer.phone || buyer.mobile || buyer.phone_number || buyer.contact || metadata?.phone || "";
  doc.fontSize(10).fillColor("#94a3b8").font("Helvetica").text("BILL TO");
  doc.fontSize(12).fillColor("#000000").font("Helvetica-Bold").text(buyer.name || buyer.fullName || "Valued Customer");
  if (buyer.email) doc.fontSize(10).font("Helvetica").fillColor("#64748b").text(buyer.email);
  if (buyerPhone) doc.fontSize(10).font("Helvetica").fillColor("#64748b").text(buyerPhone);
  if (metadata && metadata.address) doc.moveDown(0.3);
  if (metadata && metadata.address) doc.fontSize(10).font("Helvetica").fillColor("#64748b").text(formatAddress(metadata.address));
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
        <div style="font-weight: 600; font-size: 15px;">${escapeHtml(it.title || it.product?.prod_title || it.name || "Item")}</div>
        <div style="font-size: 12px; color: #94a3b8;">SKU: ${escapeHtml((it.sku || it.product?.sku || '').toString() || payment_id.slice(-6))}</div>
      </td>
      <td style="padding: 20px 0; border-bottom: 1px solid #f1f5f9; text-align: center;">${it.quantity || 1}</td>
      <td style="padding: 20px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">₹${((it.price || it.product?.prod_actualPrice || 0) / 100).toFixed(2)}</td>
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
              <div style="color: #64748b; font-size: 14px;">${escapeHtml(buyer.email || buyer.email_id || "-")}</div>
              <div style="color: #64748b; font-size: 14px;">${escapeHtml(buyer.phone || buyer.mobile || buyer.phone_number || metadata?.phone || "-")}</div>
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
  
  // 1. Generate Item List
  const itemsSummary = items.map((it) => `
    <div style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between !important; align-items: center !important;">
      <div style="text-align: left;">
        <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${escapeHtml(it.title || it.product?.prod_title || it.name || "Item")}</div>
        <div style="color: #64748b; font-size: 12px; font-weight: 400;">Quantity: ${it.quantity || 1}</div>
      </div>
      <div style="font-weight: 600; color: #0f172a; font-size: 14px;">₹${(((it.price || it.product?.prod_actualPrice) || 0) / 100).toFixed(2)}</div>
    </div>
  `).join("");

  // 2. Role-based Titles and Bold Names
  const title = role === "owner" ? "New Order Received" : "Order Confirmed";
  const subtitle = role === "owner" 
    ? `A new transaction has been processed for <strong style="color: #0f172a;">${escapeHtml(buyer.name || "a customer")}</strong>.` 
    : `Hi <strong style="color: #0f172a;">${escapeHtml(buyer.name || "there")}</strong>, your order is being prepared.`;

  // 3. Conditional Action Buttons (Only for Buyer)
  // const actionButtons = role === 'buyer' ? `
  //   <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 20px;">
  //     <div style="flex: 1;">
  //       <a href="https://www.an1meparadise.com/shop" class="btn" style="display: block; text-align: center;">Shop More</a>
  //     </div>
  //     <div style="flex: 1;">
  //       <a href="https://www.an1meparadise.com/contact" class="btn-outline" style="display: block; text-align: center;">Contact Us</a>
  //     </div>
  //   </div>
  // ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Poppins', -apple-system, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header-gradient { background: linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%); padding: 45px 30px; text-align: center; }
        .pill { background: #ffffff; border: 1px solid #bae6fd; color: #0284c7; padding: 5px 14px; border-radius: 99px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px; }
        .content { padding: 0 40px 40px 40px; }
        .order-card { background: #f8fafc; border-radius: 16px; padding: 24px; margin-top: 24px; border: 1px solid #f1f5f9; }
        .btn { background: #0f172a; color: #ffffff !important; padding: 12px 10px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 13px; border: 1px solid #0f172a; }
        .btn-outline { background: #ffffff; color: #0f172a !important; padding: 12px 10px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 13px; border: 1px solid #e2e8f0; }
        .footer { padding: 35px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; background-color: #fafafa; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header-gradient">
            <span class="pill">${role === 'owner' ? 'Internal Notification' : 'Purchase Successful'}</span>
            <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">${title}</h1>
            <p style="color: #64748b; font-size: 15px; margin-top: 10px; line-height: 1.6;">${subtitle}</p>
          </div>
          
          <div class="content">
            <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 12px; font-weight: 700;">Purchase Details</h3>
            <div style="border-top: 2px solid #0f172a;">
              ${itemsSummary || '<div style="padding: 20px; text-align: center; color: #94a3b8; display:flex; justify-content: space-between;">Custom Order</div>'}
            </div>
            
            <div class="order-card">
               <div style="display: flex !important; justify-content: space-between !important; font-size: 13px; align-items: center;">
                  <span style="color: #64748b; font-weight: 500;">Order Reference: </span>
                  <span style="color: #0f172a; font-weight: 700; font-family: monospace; font-size: 14px;">#${order_id.split('_')[1] || order_id}</span>
               </div>
               
               <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#64748b;">
                 <div>
                   <div style="font-weight:600; color:#0f172a;">${escapeHtml(buyer.name || buyer.fullName || '-')}</div>
                   <div>${escapeHtml(buyer.email || buyer.email_id || '-')}</div>
                   <div>${escapeHtml(buyer.phone || buyer.mobile || buyer.phone_number || metadata?.phone || '-')}</div>
                 </div>
                 
               </div>
            </div>
          </div>

          <div class="footer">
            <div style="font-weight: 700; color: #1e293b; margin-bottom: 6px; font-size: 14px; letter-spacing: 0.05em;">AN1MEPARADISE</div>
            <div style="line-height: 1.5;">Modern Collectibles & Premium Goods<br/>Kolkata, India</div>
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
