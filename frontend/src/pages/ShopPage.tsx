import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products, categories } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

const priceRanges = [
  { label: "Under ₹1000", min: 0, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹3000", min: 2000, max: 3000 },
  { label: "₹3000+", min: 3000, max: Infinity },
];

const productCategories = ["All", "Hoodies", "Jackets", "T-Shirts", "Accessories", "Costumes"];

const ShopPage = () => {
  const [search, setSearch] = useState("");
  const [selectedAnime, setSelectedAnime] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedAnime !== "All") result = result.filter((p) => p.animeSeries === selectedAnime);
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (sortBy === "low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, selectedAnime, selectedCategory, selectedPrice, sortBy]);

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-wider lg:text-4xl">SHOP</h1>
          <p className="text-sm text-muted-foreground">Browse our premium anime collection</p>
        </motion.div>

        {/* Search & Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground transition-all hover:border-primary lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-60 shrink-0 space-y-6 ${showFilters ? "block" : "hidden"} lg:block`}
          >
            {/* Anime Series */}
            <div>
              <h3 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider text-foreground">Anime Series</h3>
              <div className="space-y-2">
                {["All", ...categories.map((c) => c.name)].map((a) => (
                  <button
                    key={a}
                    onClick={() => setSelectedAnime(a)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      selectedAnime === a ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider text-foreground">Category</h3>
              <div className="space-y-2">
                {productCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      selectedCategory === c ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider text-foreground">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      selectedPrice === i ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {(selectedAnime !== "All" || selectedCategory !== "All" || selectedPrice !== null) && (
              <button
                onClick={() => { setSelectedAnime("All"); setSelectedCategory("All"); setSelectedPrice(null); }}
                className="flex items-center gap-1 text-xs text-destructive hover:underline"
              >
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </motion.aside>

          {/* Product Grid */}
          <div className="flex-1">
            <p className="mb-4 text-xs text-muted-foreground">{filtered.length} products found</p>
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No products match your filters</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
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
