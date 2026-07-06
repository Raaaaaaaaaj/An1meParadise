import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function OrderSuccess() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const payment_id = params.get("payment_id");
  const order_id = params.get("order_id");

  const { clearCart } = useCart();
  useEffect(() => {
  if (payment_id && order_id) {
    clearCart();
    console.log("Cart has been cleared after successful payment");
  }
}, []);

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-background">
      <div className="container mx-auto flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          {/* Success Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/15"
            >
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </motion.div>

            <h1 className="text-3xl font-black tracking-wide text-primary">
              Payment Successful 🎉
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thank you for shopping with An1meParadise. Your payment has been
              verified successfully and your order is now being processed.
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 p-6">
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Payment ID
              </p>

              <p className="mt-2 break-all font-mono text-sm text-primary">
                {payment_id}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Order ID
              </p>

              <p className="mt-2 break-all font-mono text-sm text-primary">
                {order_id}
              </p>
            <div className="mt-4">
              <a
                className="inline-block rounded bg-gradient-neon px-4 py-2 text-sm font-semibold text-black"
                href={`${API_URL}/api/invoice/${order_id}?download=1`}
              >
                Download Invoice
              </a>
            </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <Link
                to="/profile"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:scale-[1.02]"
              >
                <Package className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                My Orders
              </Link>

              <Link
                to="/shop"
                className="group flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/5 hover:scale-[1.02]"
              >
                <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
                Shop More
              </Link>
            </div>

            {/* Bottom Note */}
            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground">
                You can track your order anytime from the My Orders section.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
