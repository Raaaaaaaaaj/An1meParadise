import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Minus, Plus, Zap } from "lucide-react";
import { products } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.animeSeries === product.animeSeries && p.id !== product.id);

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
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">
              {product.animeSeries}
            </p>
            <h1 className="mb-4 font-display text-2xl font-bold tracking-wider lg:text-3xl">
              {product.name}
            </h1>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-foreground">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-semibold text-destructive">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
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
                onClick={() => { for (let i = 0; i < quantity; i++) addItem(product, selectedSize); }}
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
            <h2 className="mb-8 font-display text-2xl font-bold tracking-wider">MORE FROM {product.animeSeries.toUpperCase()}</h2>
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
