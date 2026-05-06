import { motion } from "framer-motion";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
const API_URL = import.meta.env.VITE_API_URL;


const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20">
        <p className="font-display text-xl tracking-wider text-muted-foreground">Your cart is empty</p>
        <Link to="/shop" className="rounded-xl bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-foreground">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 font-display text-3xl font-bold tracking-wider">
          YOUR CART
        </motion.h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                  <img src= {`${API_URL}/uploads/${item.product.image}`} 
                alt={item.product.prod_title} className="h-24 w-24 rounded-lg object-cover lg:h-32 lg:w-32" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-primary">{item.product.animeSeries}</p>
                    <h3 className="font-heading text-sm font-semibold lg:text-base text-primary">{item.product.prod_title}</h3>
                    {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded border border-border p-1.5 hover:bg-secondary text-primary">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[30px] text-center text-sm font-medium text-primary">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded border border-border p-1.5 hover:bg-secondary text-primary">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-heading text-lg font-bold text-primary">₹{item.product.prod_actualPrice * item.quantity}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="self-start text-muted-foreground hover:text-destructive">
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6 font-display text-lg font-bold tracking-wider text-primary">ORDER SUMMARY</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span>{totalPrice >= 999 ? "FREE" : "₹149"}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-heading text-lg font-bold">
                  <span>Total</span><span className="text-primary">₹{totalPrice + (totalPrice >= 999 ? 0 : 99)}</span>
                </div>
              </div>
            </div>
            <Link to="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-neon py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
