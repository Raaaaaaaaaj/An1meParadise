import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

const CheckoutPage = () => {
  const { items, totalPrice } = useCart();

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 font-display text-3xl font-bold tracking-wider">
          CHECKOUT
        </motion.h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Billing */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider">Billing Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input placeholder="First Name" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <input placeholder="Last Name" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <input placeholder="Email" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:col-span-2" />
                <input placeholder="Phone" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:col-span-2" />
              </div>
            </motion.div>

            {/* Shipping */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input placeholder="Address Line 1" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:col-span-2" />
                <input placeholder="City" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <input placeholder="State" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <input placeholder="PIN Code" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <input placeholder="Country" defaultValue="India" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
            </motion.div>

            {/* Payment Placeholder */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider">Payment Method</h2>
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
                <p className="text-sm text-muted-foreground">Payment gateway integration ready</p>
                <p className="mt-1 text-xs text-muted-foreground/60">Razorpay / Stripe structure prepared</p>
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span><span>{totalPrice >= 999 ? "FREE" : "₹99"}</span>
                </div>
                <div className="mt-2 flex justify-between font-heading text-lg font-bold">
                  <span>Total</span><span className="text-primary">₹{totalPrice + (totalPrice >= 999 ? 0 : 99)}</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full rounded-xl bg-gradient-neon py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              Place Order
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
