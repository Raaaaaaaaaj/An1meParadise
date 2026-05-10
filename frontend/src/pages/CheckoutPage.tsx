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
    <div className="min-h-screen overflow-x-hidden pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 font-display text-3xl font-bold tracking-wider"
        >
          CHECKOUT
        </motion.h1>
  
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* Billing Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-4 sm:p-6"
            >
              <AddressTab />
            </motion.div>
          </div>
  
          {/* Order Summary */}
          <div className="h-fit w-full overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-4 break-words font-display text-lg font-bold uppercase tracking-wider text-primary sm:text-xl">
              Order Summary
            </h3>
  
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id}>
                  <div className="flex items-start justify-between gap-2 overflow-hidden text-sm">
                    
                    {/* Product Name */}
                    <span className="min-w-0 flex-1 break-words text-primary">
                      {item.product.prod_title}
                    </span>
  
                    {/* Qty × Price */}
                    <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
                      {item.quantity} × ₹{item.product.prod_actualPrice}
                    </span>
  
                    {/* Total */}
                    <span className="shrink-0 font-medium text-primary">
                      ₹{item.product.prod_actualPrice * item.quantity}
                    </span>
                  </div>
  
                  <hr className="mt-2 border-border" />
                </div>
              ))}
  
              {/* Price Details */}
              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
  
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
  
                <div className="mt-2 flex items-center justify-between font-heading text-base font-bold sm:text-lg">
                  <span className="text-primary">Total</span>
                  <span className="text-primary">₹{finalTotal}</span>
                </div>
              </div>
            </div>
  
            {/* Payment Button */}
            <RazorpayCheckout
              amountInPaise={Math.round(finalTotal * 100)}
              description={`An1meParadise Order - ₹${finalTotal}`}
              className="mt-6 w-full rounded-xl bg-gradient-neon px-4 py-4 text-center font-heading text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 sm:text-sm"
            >
              Choose Payment Method
            </RazorpayCheckout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;