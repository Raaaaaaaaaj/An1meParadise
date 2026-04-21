import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react"; // ✅ add this

const API_URL = import.meta.env.VITE_API_URL;

interface ProductCardProps {
  product: any;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();

  const [liked, setLiked] = useState(false); // ✅ state

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg"
    >
      
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={`${API_URL}/uploads/${product.image}`}
            alt={product.prod_title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

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
              onClick={() => setLiked(!liked)} // ✅ toggle
              className={`rounded-lg p-2 border transition ${
                liked 
                  ? "bg-red-500 text-white border-red-500" 
                  : "bg-black text-white border-border"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-white" : ""
                }`}
              />
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