import { motion } from "framer-motion";
import { Sparkles, Users, Shield, Heart } from "lucide-react";

const values = [
  { icon: Sparkles, 
    title: "Unleash Your Anime World", 
    // desc: "Every piece is crafted with top-tier materials and authentic anime artwork." 
  },
  { icon: Users, 
    title: "From Screen to Shelf", 
    // desc: "Built by otakus, for otakus. We know what true fans want." 
  },
  { icon: Heart, 
    title: "Collect What You Love", 
    // desc: "Licensed and original designs. No knockoffs, ever." 
  },
  { icon: Shield, 
    title: "Powered by Passion, Priced for Fans",
    // desc: "We don't just sell merch — we celebrate anime culture."
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">✦ Our Story</p>
          <h1 className="mb-6 font-display text-3xl font-bold tracking-wider lg:text-5xl">
            ABOUT <span className="text-glow-purple">AN1ME PARADISE</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
           An1me Paradise is your ultimate destination for premium anime figures and collectibles at prices that actually make sense. Built for true anime fans, we bring iconic characters to life with high-quality designs, detailed craftsmanship, and a vibe that matches your passion. Whether you're starting your collection or leveling it up, this is your place to turn anime dreams into reality.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border/50 bg-card p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-sm font-bold text-primary">{v.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-primary/20 bg-gradient-hero p-8 text-center lg:p-12"
        >
          <h2 className="mb-4 font-display text-2xl font-bold tracking-wider">OUR MOTTOS</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            To make premium anime merchandise accessible to every fan in India. We believe your wardrobe should be as epic as the anime you love —
            and we're here to make that happen with world-class designs and unbeatable quality.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
