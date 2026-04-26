import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import heroVdo from "@/assets/herovdo.mp4";
import { products, testimonials } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;


const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₹499" },
  { icon: Shield, title: "Authentic Merch", desc: "100% genuine products" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: Sparkles, title: "Premium Quality", desc: "Handpicked collections" },
];

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 attach product count
  const fetchProductCounts = async (categories) => {
    return Promise.all(
      categories.map(async (cat) => {
        try {
          const res = await axios.get(
            // `http://localhost:5000/api/products?category=${cat.category_name}`
            `${API_URL}/api/products?category=${cat.category_name}`
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

  // 🔥 Fetch categories + count
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* <img src={heroBanner} alt="AN1ME PARADISE" className="h-full w-full object-cover" /> */}
          <video
            src={heroVdo}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-32 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-widest text-primary"
            >
              Unleash Your Anime World ⚡
            </motion.p>
            <h1 className="mb-6 font-display text-2xl font-black leading-tight tracking-wider text-glow-purple sm:text-5xl lg:text-5xl">
              Step into An1me Paradise 🎌
              <br />
              <span>Where your favorite anime turns real.</span>
              <br />

              <span
                className="text-white font-bold tracking-wider"
                style={{ textShadow: "5px 5px 5px rgba(0, 0, 0, 0.84)" }}
              >
                Premium figures. Clean vibes. Affordable drip.
              </span>
            </h1>
            <p className="mb-8 max-w-lg font-body text-primary lg:text-lg">
              Discover India's most exclusive anime merch collection. From premium hoodies to limited edition collectibles — gear up like a true weeb.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-neon px-8 py-4 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link to="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-border px-8 py-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  Browse Categories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating glow elements */}
        <div className="absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -left-20 bottom-1/4 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />
      </section>

      {/* Features Bar */}
      <section className="border-y border-border/50 bg-secondary/20">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 lg:py-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 justify-center"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-heading text-xs font-semibold text-foreground">{f.title}</p>
                <p className="text-[10px] text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
              ✦ Trending Now
            </p>
            <h2 className="font-display text-3xl font-bold tracking-wider lg:text-4xl">
              FEATURED MERCH
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border border-primary-foreground px-8 py-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                View All Products
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/10 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
              ✦ Shop By Anime
            </p>
            <h2 className="font-display text-3xl font-bold tracking-wider lg:text-4xl">
              CHOOSE YOUR UNIVERSE
            </h2>
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
      </section>

      {/* Limited Edition */}
      {/* <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
              ✦ Don't Miss Out
            </p>
            <h2 className="font-display text-3xl font-bold tracking-wider lg:text-4xl">
              NEW ARRIVALS
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="bg-secondary/10 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
              ✦ What Our Fans Say
            </p>
            <h2 className="font-display text-3xl font-bold tracking-wider lg:text-4xl">
              MOTIVATING REVIEWS
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-card p-6"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-sm text-accent">★</span>
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-display text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <span className="font-heading text-sm font-semibold text-primary">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-hero p-8 text-center lg:p-16"
          >
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-[80px]" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-[80px]" />
            <div className="relative z-10">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-wider lg:text-4xl">
                JOIN THE <span className="text-glow-purple">OTAKU CLUB</span>
              </h2>
              <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
                Get exclusive drops, early access to limited editions, and 10% off your first order.
              </p>
              <div className="mx-auto flex max-w-md gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-neon px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
