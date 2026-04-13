import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Category } from "@/data/mockData";
import axios from "axios";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/shop?anime=${category.slug}`}
        className="group relative block aspect-square overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
      >
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
          <h3 className="font-display text-lg font-bold tracking-wider text-foreground lg:text-xl">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground">{category.productCount} Products</p>
        </div>
        <div className="absolute inset-0 border-2 border-primary/0 rounded-2xl transition-all duration-300 group-hover:border-primary/40" />
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
