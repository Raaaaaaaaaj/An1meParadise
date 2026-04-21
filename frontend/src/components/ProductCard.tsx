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

/* ================== Wishlist Helpers ================== */

const getWishlist = () => {
  const data = localStorage.getItem("wishlist");

  if (!data) return [];

  const parsed = JSON.parse(data);

  // expiry check
  if (new Date().getTime() > parsed.expiry) {
    localStorage.removeItem("wishlist");
    return [];
  }

  return parsed.items || [];
};

const saveWishlist = (items: any[]) => {
  const data = {
    items,
    expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  localStorage.setItem("wishlist", JSON.stringify(data));
};

/* ================== Component ================== */

const ProductCard = ({ product, index = 0, onRemove }: ProductCardProps) => {
  const { addItem } = useCart();

  // ✅ initial state from localStorage
  const [liked, setLiked] = useState(() => {
    const wishlist = getWishlist();
    return wishlist.some((item: any) => item.id === product.id);
  });

  // ✅ MAIN LOGIC
  // const handleWishlist = () => {
  //   let wishlist = getWishlist();

  //   const exists = wishlist.some((item: any) => item.id === product.id);

  //   if (exists) {
  //     // ❌ remove
  //     wishlist = wishlist.filter((item: any) => item.id !== product.id);
  //   } else {
  //     // ✅ add
  //     wishlist.push(product);
  //   }

  //   saveWishlist(wishlist);
  //   setLiked(!exists);
  // };

  const handleWishlist = () => {
  let wishlist = getWishlist();

  const exists = wishlist.some((item: any) => item.id === product.id);

  if (exists) {
    // ❌ remove
    wishlist = wishlist.filter((item: any) => item.id !== product.id);
    saveWishlist(wishlist);

    setLiked(false);

    // 🔥 IMPORTANT (parent update)
    if (onRemove) {
      onRemove(product.id);
    }

  } else {
    // ✅ add
    wishlist.push(product);
    saveWishlist(wishlist);

    setLiked(true);
  }
};


  return (
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

        {/* Price + Actions */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            ₹{Number(product.prod_actualPrice)}
          </span>

          <div className="flex items-center gap-2">
            
            {/* ❤️ Wishlist */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist} // ✅ FIXED
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
  );
};

export default ProductCard;