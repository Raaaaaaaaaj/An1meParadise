import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface ProductCardProps {
  product: any;
  index?: number;
  onRemove?: (id: number) => void;
}

/* ================= Helpers ================= */

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getWishlist = () => {
  const data = localStorage.getItem("wishlist");

  if (!data) return [];

  const parsed = JSON.parse(data);

  if (new Date().getTime() > parsed.expiry) {
    localStorage.removeItem("wishlist");
    return [];
  }

  return parsed.items || [];
};

const saveWishlist = (items: any[]) => {
  const data = {
    items,
    expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
  };

  localStorage.setItem("wishlist", JSON.stringify(data));
};

/* ================= Component ================= */

const ProductCard = ({ product, index = 0, onRemove }: ProductCardProps) => {
  const { addItem } = useCart();

  const [liked, setLiked] = useState(() => {
    const wishlist = getWishlist();
    return wishlist.some((item: any) => item.id === product.id);
  });

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleWishlist = () => {
    const user = getUser();

    // ❌ Not logged in
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    let wishlist = getWishlist();
    const exists = wishlist.some((item: any) => item.id === product.id);

    if (exists) {
      // remove
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      saveWishlist(wishlist);
      setLiked(false);

      // notify parent (wishlist page)
      if (onRemove) onRemove(product.id);

    } else {
      // add
      wishlist.push(product);
      saveWishlist(wishlist);
      setLiked(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg"
      >
        {/* Badge */}
        {product.prod_badgeName && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase text-white">
            {product.prod_badgeName}
          </span>
        )}

        {/* Image */}
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <img
              src={`${API_URL}/uploads/${product.image}`}
              alt={product.prod_title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="p-4">
          <p className="mb-1 text-[10px] font-medium uppercase text-primary">
            {product.category_name}
          </p>

          <Link to={`/product/${product.id}`}>
            <h3 className="mb-2 text-sm text-primary font-semibold line-clamp-2">
              {product.prod_title}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-primary">
              ₹{Number(product.prod_actualPrice)}
            </span>

            <div className="flex items-center gap-2">

              {/* ❤️ Wishlist */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`rounded-lg p-2 border transition ${
                  liked
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-black text-white border-border"
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
              </motion.button>

              {/* 🛒 Cart */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => addItem(product)}
                className="rounded-lg bg-black p-2 text-white"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>

            </div>
          </div>
        </div>
      </motion.div>

      {/* 🔐 Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 text-center w-80">
            <h2 className="text-lg font-semibold mb-2">Login Required</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please login first to use wishlist ❤️
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <Link
                to="/login"
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;