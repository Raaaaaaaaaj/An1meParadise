import { motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();
  console.log("CART ITEMS:", items);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-black"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-lg font-bold tracking-wider text-primary">YOUR CART</h2>
          <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-primary px-6 py-2 font-heading text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.product.id} className="mb-4 flex gap-4 rounded-lg border border-border bg-card p-3 bg-primary">
                  <img src= {`${API_URL}/uploads/${item.product.image}`} 
                  alt={item.product.prod_title} className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      {/* <p className="font-heading text-sm font-semibold">{item.product.name}</p> */}
                      <p className="font-heading text-sm font-semibold">
                       {item.product.prod_title}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.size && `Size: ${item.size}`}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded border border-border p-1 hover:bg-secondary">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded border border-border p-1 hover:bg-secondary">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {/* <p className="font-heading text-sm font-bold text-black">₹{item.product.price * item.quantity}</p> */}
                      <p className="font-heading text-sm font-bold text-black">
                        ₹{Number(item.product.prod_actualPrice) * item.quantity}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="self-start text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4 space-y-3">
              <div className="flex justify-between font-heading text-lg font-bold">
                <span className="text-primary">Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg bg-primary py-3 text-center font-heading text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg border border-primary py-3 text-center font-heading text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default CartDrawer;
