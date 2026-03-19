import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeColors: Record<string, string> = {
  new: "bg-neon-blue",
  hot: "bg-accent",
  limited: "bg-primary",
  sale: "bg-destructive",
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Badge */}
      {product.badge && (
        <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground ${badgeColors[product.badge]}`}>
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button className="absolute right-3 top-3 z-10 rounded-full bg-background/60 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:bg-background hover:text-accent">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-primary">
          {product.animeSeries}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mb-2 font-heading text-sm font-semibold text-primary transition-colors hover:text-primary line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? "text-accent" : "text-muted"}`}>★</span>
          ))}
          <span className="ml-1 text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addItem(product)}
            className="rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
