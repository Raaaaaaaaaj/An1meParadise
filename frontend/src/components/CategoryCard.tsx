import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

interface CategoryCardProps {
  category: {
    id: number;
    category_name: string;
    category_image: string;
    productCount?: number;
  };
  index?: number;
}


const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  const slug = category.category_name.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/shop?anime=${slug}`}
        className="group relative block aspect-square overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
      >
        <img
          // src={category.category_image}
          src={`${API_URL}/uploads/${category.category_image}`}
          alt={category.category_name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
          <h3 className="font-display text-lg font-bold tracking-wider text-primary lg:text-xl">
            {category.category_name}
          </h3>

          {/* ✅ FIXED */}
          <p className="text-xs text-muted-foreground">
            {category.productCount ?? 0} Products
          </p>
        </div>

        <div className="absolute inset-0 border-2 border-primary/0 rounded-2xl transition-all duration-300 group-hover:border-primary/40" />
      </Link>
    </motion.div>
  );
};

export default CategoryCard;