import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";

const WishListPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ✅ localStorage se data lana + expiry check
  const getWishlist = () => {
    const data = localStorage.getItem("wishlist");

    if (!data) return [];

    const parsed = JSON.parse(data);

    if (new Date().getTime() > parsed.expiry) {
      localStorage.removeItem("wishlist");
      return [];
    }

    return parsed.items || [];
  };

  // ✅ mount pe load
  useEffect(() => {
    const wishlistItems = getWishlist();
    setProducts(wishlistItems);
    setLoadingProducts(false);
  }, []);

  return (
    <div>
      <div className="min-h-screen pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
              ✦ View Your Wish List ✦
            </p>
            <h1 className="font-display text-3xl font-bold tracking-wider lg:text-5xl">
              YOUR WISHLIST
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Revisit your favorite anime products and keep track of what you want to buy next!
            </p>
          </motion.div>

          {/* ✅ SAME GRID (no change) */}
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

export default WishListPage;