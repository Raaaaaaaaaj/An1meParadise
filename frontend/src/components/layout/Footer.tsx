import { Link } from "react-router-dom";

const footerlinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const footermorelinks = [
  { href: "/termsConditions", label: "Terms & Conditions" },
  { href: "/privacyPolicy", label: "Privacy Policy" },
  { href: "/returnPolicy", label: "Return Policy" },
  // { href: "/faqs", label: "FAQs" },
  // { href: "/faqs", label: "Shipping Info" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo2.png" 
            alt="AN1ME PARADISE"
            className="h-20 w-auto lg:h-24 object-contain"
          />
        </Link>
            <p className="text-sm text-black">
              India's premium destination for anime merchandise. Authentic, high-quality apparel and collectibles.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {footerlinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-black transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          {/* <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Top Anime</h4>
            <div className="flex flex-col gap-2">
              {["Naruto", "One Piece", "Demon Slayer", "Dragon Ball", "Jujutsu Kaisen"].map((c) => (
                <Link key={c} to="/categories" className="text-sm text-black transition-colors hover:text-primary">
                  {c}
                </Link>
              ))}
            </div>
          </div> */}

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Support</h4>
            <div className="flex flex-col gap-2">
            {footermorelinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-black transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-xs text-foregorund">
            © 2026 AN1ME PARADISE. All rights reserved. Premium Anime Merchandise Store.
          </p>
          <p className="text-xs text-foregorund mt-8">
            © Designed,Developed and Maintained by <span><a href="https://codenclicksit.in/" target="_blank" rel="noopener noreferrer">CodeNClicks IT Solutions</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
