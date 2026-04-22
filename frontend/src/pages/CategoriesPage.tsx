import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 fetch product counts
  const fetchProductCounts = async (categories: any[]) => {
    return Promise.all(
      categories.map(async (cat) => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/products?category=${cat.category_name}`
          );

          const products = res.data.data || res.data || [];

          return {
            ...cat,
            productCount: products.length,
          };
        } catch (err) {
          console.error(err);
          return {
            ...cat,
            productCount: 0,
          };
        }
      })
    );
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      // const res = await axios.get("http://localhost:5000/api/categories");
      const res = await axios.get(`${API_URL}/api/categories`);

      const data = res.data;

      const updated = await fetchProductCounts(data);

      setCategories(updated);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
            ✦ Browse by Universe
          </p>
          <h1 className="font-display text-3xl font-bold tracking-wider lg:text-5xl">
            ANIME CATEGORIES
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Choose your favorite anime and explore exclusive merchandise
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;