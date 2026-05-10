
import express from "express";
import { createOrder, verifyPayment, buildInvoiceHtml, generatePdfBufferFromHtml } from "../controllers/payment.controller.js";
import { getPaymentByOrderId } from "../models/payment.model.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", createOrder);

// Verify payment signature
router.post("/verify-payment", verifyPayment);

// Get invoice (attachment or inline)
router.get("/invoice/:order_id", async (req, res) => {
	try {
		const { order_id } = req.params;
		const payment = await getPaymentByOrderId(order_id);
		if (!payment) return res.status(404).send("Invoice not found");

		let metadata = null;
		if (payment.metadata) {
			try {
				metadata = typeof payment.metadata === 'string' ? JSON.parse(payment.metadata) : payment.metadata;
			} catch (e) {
				console.error('Failed to parse payment.metadata:', e);
				metadata = null;
			}
		}
		const html = buildInvoiceHtml({ order_id: payment.razorpay_order_id, payment_id: payment.razorpay_payment_id, metadata });

		// If client asked for PDF (format=pdf), try to generate PDF and send
		if (req.query.format === "pdf" || req.query.format === "PDF") {
			try {
				const pdfBuf = await generatePdfBufferFromHtml({ order_id: payment.razorpay_order_id, payment_id: payment.razorpay_payment_id, metadata });
				if (!pdfBuf) throw new Error("PDF generation returned empty buffer");
				if (req.query.download === "1") {
					res.setHeader("Content-Disposition", `attachment; filename=invoice_${payment.razorpay_order_id}.pdf`);
				}
				res.setHeader("Content-Type", "application/pdf");
				return res.send(pdfBuf);
			} catch (pdfErr) {
				console.error("Failed to generate PDF for invoice route:", pdfErr.message || pdfErr);
				// fall back to HTML
			}
		}

		// if query param download=1 then send as attachment
		if (req.query.download === "1") {
			res.setHeader("Content-Disposition", `attachment; filename=invoice_${payment.razorpay_order_id}.html`);
		}
		res.setHeader("Content-Type", "text/html");
		res.send(html);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

export default router;
