import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Minus, Plus, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetailPage = () => {
  const { id } = useParams(); // ✅ slug → id
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const images = product.images?.filter(Boolean) || [];

  // ✅ PRODUCT FETCH
  useEffect(() => {
    console.log("Entyered ProductDetailPage with ID:", id);

  if (!id) return;

  const getProduct = async () => {
    console.log("Fetching product with ID:", id);
    try {
      const response = await fetch(`${API_URL}/api/product/${id}`);
      
      if (!response.ok) {
        // If 404 or 500, set product to null to stop loading state
        setProduct(null);
        console.error("Failed to fetch product");
        return;
      }

      const data = await response.json();
      console.log("Fetched Product:", data);
      setProduct(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setProduct(null); // Stop loading on network error
    }
  };

  getProduct();
}, [id]);

  // ✅ RELATED PRODUCTS FETCH (same category)
  useEffect(() => {
    if (!product) return;

    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          (p: any) =>
            p.category_name === product.category_name &&
            p.id !== product.id
        );
        setRelatedProducts(filtered);
      });
  }, [product]);

  // ✅ LOADING
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border/50"
          >
            <img
              src={`${API_URL}/uploads/${images[0]}`} // ✅ FIXED
              alt={product.prod_title} // ✅ FIXED
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.prod_badgeName && (
              <span className="absolute left-4 top-4 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {product.prod_badgeName}
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">
              {product.category_name} {/* ✅ FIXED */}
            </p>

            <h1 className="mb-4 font-display text-2xl font-bold tracking-wider lg:text-3xl">
              {product.prod_title} {/* ✅ FIXED */}
            </h1>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(100 reviews)</span>
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-foreground">
                ₹{product.prod_actualPrice} {/* ✅ FIXED */}
              </span>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {product.prod_description} {/* ✅ FIXED */}
            </p>

            {/* Size (optional if backend me ho) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider">Quantity</p>
              <div className="inline-flex items-center rounded-lg border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[40px] text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { for (let i = 0; i < quantity; i++) addItem(product); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-neon py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent bg-accent/10 py-4 font-heading text-sm font-bold uppercase tracking-wider text-accent"
              >
                <Zap className="h-4 w-4" /> Buy Now
              </motion.button>
              <button className="rounded-xl border border-border p-4 text-muted-foreground transition-all hover:border-accent hover:text-accent">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <h2 className="mb-8 font-display text-2xl font-bold tracking-wider">
              MORE FROM {product.category_name.toUpperCase()}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;