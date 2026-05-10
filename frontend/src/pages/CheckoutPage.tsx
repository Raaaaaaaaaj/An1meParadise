import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import AddressTab from "@/components/profile/AddressTab";
import RazorpayCheckout from "@/components/RazorpayCheckout";

const CheckoutPage = () => {
  const { items, totalPrice } = useCart();

  // ✅ Shipping logic
  const shippingFee = totalPrice < 449 ? 149 : 0;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 font-display text-3xl font-bold tracking-wider"
        >
          CHECKOUT
        </motion.h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Billing address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <AddressTab />
            </motion.div>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-xl font-bold uppercase tracking-wider text-primary">
              Order Summary
            </h3>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id}>
                  <div className="flex justify-between text-sm gap-2">
                    <span className="text-primary truncate w-48">
                      {item.product.prod_title}
                    </span>

                    <span className="text-muted-foreground whitespace-nowrap">
                      {item.quantity} × ₹{item.product.prod_actualPrice}
                    </span>

                    <span className="text-primary whitespace-nowrap">
                      ₹{item.product.prod_actualPrice * item.quantity}
                    </span>
                  </div>

                  <hr className="mt-2" />
                </div>
              ))}

              <div className="pt-3 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>

                <div className="mt-2 flex justify-between font-heading text-lg font-bold">
                  <span className="text-primary">Total</span>
                  <span className="text-primary">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <RazorpayCheckout
              amountInPaise={Math.round(finalTotal * 100)}
              description={`An1meParadise Order - ₹${finalTotal}`}
              className="mt-6 w-full rounded-xl bg-gradient-neon py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Choose payment method
            </RazorpayCheckout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;