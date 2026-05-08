import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import AddressTab from "@/components/profile/AddressTab";
import RazorpayCheckout from "@/components/RazorpayCheckout";


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
            {/* Billing address */}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">

              <AddressTab/>

              </motion.div>
            
            
            

            {/* Payment Placeholder */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-primary">Payment Method</h2>
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
                <p className="text-sm text-muted-foreground">Payment gateway integration ready</p>
                <p className="mt-1 text-xs text-muted-foreground/60">Razorpay / Stripe structure prepared</p>
              </div>

              <div className="mt-6 text-center">
                {typeof totalPrice === "number" && (
                  <RazorpayCheckout
                    amountInPaise={Math.round((totalPrice + (totalPrice >= 499 ? 0 : 149)) * 100)}
                    description={`An1meParadise Order - ₹${totalPrice + (totalPrice >= 499 ? 0 : 149)}`}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-xl font-bold uppercase tracking-wider text-primary">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div>
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-primary truncate w-48">{item.product.prod_title}</span>
                  <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                  <span className="text-primary">₹{item.product.prod_actualPrice * item.quantity}</span>
                  </div>
                  <hr className="mt-2" />
                </div>
              ))}
              <div className="pt-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span><span>{totalPrice >= 999 ? "FREE" : "₹149"}</span>
                </div>
                <div className="mt-2 flex justify-between font-heading text-lg font-bold">
                  <span className="text-primary">Total</span><span className="text-primary">₹{totalPrice + (totalPrice >= 999 ? 0 : 149)}</span>
                </div>
              </div>
            </div>
            {/* <RazorpayCheckout
              amountInPaise={Math.round((totalPrice + (totalPrice >= 499 ? 0 : 149)) * 100)}
              description={`An1meParadise Order - ₹${totalPrice + (totalPrice >= 499 ? 0 : 149)}`}
              className="mt-6 w-full rounded-xl bg-gradient-neon py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order
            </RazorpayCheckout> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
