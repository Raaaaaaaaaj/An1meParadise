import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

interface ProductCardProps {
  product: any;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();

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
            src={`${API_URL}/uploads/${product.image}`}   // ✅ FIXED
            alt={product.prod_title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-[10px] font-medium uppercase text-primary">
          {product.category_name}
        </p>

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="mb-2 text-sm text-primary font-semibold line-clamp-2">
            {product.prod_title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
          {product.prod_description}
        </p>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            ₹{Number(product.prod_actualPrice)}
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            // onClick={() => addItem(product)}
            onClick={() => {
              console.log("Button Clicked", product);
              addItem(product);
            }}
            className="rounded-lg bg-black text-background p-2 text-white"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;