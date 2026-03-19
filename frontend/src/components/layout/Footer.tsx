import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-xl font-bold tracking-wider text-glow-purple">AN1ME</span>
              <span className="font-display text-xl font-bold tracking-wider text-foreground"> PARADISE</span>
            </Link>
            <p className="text-sm text-black">
              India's premium destination for anime merchandise. Authentic, high-quality apparel and collectibles.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Shop", "Categories", "About", "Contact"].map((l) => (
                <Link key={l} to={`/${l.toLowerCase()}`} className="text-sm text-black transition-colors hover:text-primary">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Top Anime</h4>
            <div className="flex flex-col gap-2">
              {["Naruto", "One Piece", "Demon Slayer", "Dragon Ball", "Jujutsu Kaisen"].map((c) => (
                <Link key={c} to="/categories" className="text-sm text-black transition-colors hover:text-primary">
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Support</h4>
            <div className="flex flex-col gap-2">
              {["FAQ", "Shipping Info", "Returns", "Track Order"].map((s) => (
                <span key={s} className="cursor-pointer text-sm text-black transition-colors hover:text-primary">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-xs text-foregorund">
            © 2026 AN1ME PARADISE. All rights reserved. Premium Anime Merchandise Store.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
