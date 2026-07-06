import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "react-router-dom"; 

const API_URL = import.meta.env.VITE_API_URL;

import ProductCard from "@/components/ProductCard";

const PRODUCTS_PER_PAGE = 24;

const ShopPage = () => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const productsScrollRef = useRef(null);
  

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        // const res = await axios.get(`${API_URL}/api/categories`);
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

  useEffect(() => {
    if (productsScrollRef.current) {
      productsScrollRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // ✅ FETCH PRODUCTS (FILTER BASED)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProducts([]);

        let url = `${API_URL}/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`;

        if (selectedCategory !== "All") {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        if (sortBy) {
          url += `&sort=${encodeURIComponent(sortBy)}`;
        }

        const res = await axios.get(url);
        const payload = res.data;
        const data = Array.isArray(payload) ? payload : payload.data || [];
        const totalCount = Array.isArray(payload)
          ? data.length
          : Number(payload.total || data.length || 0);
        const pageCount = Array.isArray(payload)
          ? 1
          : Number(payload.totalPages || Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE))) || 1;

        setProducts(data);
        setTotalProducts(totalCount);
        setTotalPages(pageCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, sortBy, currentPage]);

  const renderSkeletonCards = (count = 10) =>
    Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="h-40 animate-pulse rounded-xl bg-muted/80" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted/80" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted/80" />
        <div className="h-8 w-full animate-pulse rounded-xl bg-muted/80" />
      </div>
    ));

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
              {/* <SlidersHorizontal /> */}
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
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <p>
                Showing {products.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1}-{Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} of {totalProducts} products
              </p>
              {!loadingProducts && totalPages > 1 && (
                <p>Page {currentPage} of {totalPages}</p>
              )}
            </div>

            {loadingProducts ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {renderSkeletonCards()}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                No products found
              </div>
            ) : (
              <>
                <div className="max-h-[70vh] overflow-y-auto pr-2" ref={productsScrollRef}>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          ...product
                          // image: `${API_URL}/uploads/${product.image}`,
                        }}
                        index={(currentPage - 1) * PRODUCTS_PER_PAGE + i}
                      />
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-full px-4 py-2 text-sm ${currentPage === page ? "bg-primary text-primary-foreground" : "border hover:bg-secondary"}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-full border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;