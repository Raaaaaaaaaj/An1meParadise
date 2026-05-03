import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "react-router-dom"; 

const API_URL = import.meta.env.VITE_API_URL;

import ProductCard from "@/components/ProductCard";

const ShopPage = () => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        // const res = await axios.get(`http://localhost:5000/api/categories`);
        const data = res.data.data || res.data || [];
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

useEffect(() => {
  const animeParam = searchParams.get("anime");

  if (animeParam) {
    const formatted = animeParam.replace(/-/g, " ");
    setSelectedCategory(formatted);
  }
}, [searchParams]);

  // ✅ FETCH PRODUCTS (FILTER BASED)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        let url = `${API_URL}/api/products?`;

        if (selectedCategory !== "All") {
          url += `category=${selectedCategory}&`;
        }

        if (search) {
          url += `search=${search}&`;
        }

        if (sortBy) {
          url += `sort=${sortBy}`;
        }

        const res = await axios.get(url);

        const data = res.data.data || res.data || [];
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, sortBy]);

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold lg:text-4xl">SHOP</h1>
          <p className="text-sm text-muted-foreground">
            Browse our premium collection
          </p>
        </motion.div>

        {/* SEARCH + SORT */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl border px-4 py-3 text-sm bg-card text-primary"
          />

          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border px-4 py-3"
            >
              <option value="popular">Popular</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
              <option value="latest">Latest</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border px-4 py-3 rounded-xl"
            >
              <SlidersHorizontal />
            </button>
          </div>
        </div>

        <div className="flex gap-8">

          {/* SIDEBAR */}
          <aside className={`w-60 space-y-4 ${showFilters ? "block" : "hidden"} lg:block`}>

            <h3 className="text-xs font-semibold uppercase">Category</h3>

            <button
              onClick={() => setSelectedCategory("All")}
              className={`block w-full text-left px-3 py-2 ${
                selectedCategory === "All" ? "text-primary" : ""
              }`}
            >
              All
            </button>

            {loadingCategories ? (
              <p>Loading...</p>
            ) : (
              categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.category_name)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === c.category_name ? "text-primary bg-primary/20" : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {c.category_name}
                </button>
              ))
            )}
          </aside>

          {/* PRODUCTS */}
          <div className="flex-1">

            <p className="mb-4 text-sm text-muted-foreground">
              {products.length} products found
            </p>

            {loadingProducts ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products found</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product
                      // image: `${API_URL}/uploads/${product.image}`,
                    }}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;