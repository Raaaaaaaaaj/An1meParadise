import { motion } from "framer-motion";
import { categories } from "@/data/mockData";
import CategoryCard from "@/components/CategoryCard";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">✦ Browse by Universe</p>
          <h1 className="font-display text-3xl font-bold tracking-wider lg:text-5xl">ANIME CATEGORIES</h1>
          <p className="mt-4 text-sm text-muted-foreground">Choose your favorite anime and explore exclusive merchandise</p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
