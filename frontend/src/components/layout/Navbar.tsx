import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initials, setInitials] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // const name = localStorage.getItem("name"); 
    const name = localStorage.getItem("user.userName");

    

    if (token) {
      setIsLoggedIn(true);

      if (name) {
        const words = name.split(" ");
        const initials = words.map(w => w[0]).join("").toUpperCase();
        setInitials(initials);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const name = localStorage.getItem("name");
    // const name = "John Walker";

    console.log("name :" , name);
  
    if (name) {
      const words = name.split(" ");
      console.log("Words:", words);
  
      const initials = words.map(w => w[0]).join("").toUpperCase();
      console.log("Generated Initials:", initials);
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-wider text-glow-purple lg:text-2xl">
            AN1ME
          </span>
          <span className="font-display text-xl font-bold tracking-wider text-foreground lg:text-2xl">
            PARADISE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-heading text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/shop" className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground">
            <Search className="h-5 w-5" />
          </Link>
          <Link to="/wishlist" className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground sm:block">
            <Heart className="h-5 w-5" />
          </Link>

          {/* user */}

          {/* <Link to="/signup" className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground sm:block">
            <User className="h-5 w-5" />
          </Link> */}


        <div className="relative">
          
          {/* ICON / INITIALS */}
          

          <button
            onClick={() => setOpen(!open)}
            className="hidden sm:flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground"
          >
            {isLoggedIn ? (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                {initials}
              </div>
            ) : (
              <User className="h-5 w-5" />
            )}
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white border z-50">
              
              {!isLoggedIn ? (
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Sign-up / Log-in
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Log-out
                  </button>
                </>
              )}
            </div>
          )}
        </div>





          <button
            onClick={() => setIsOpen(true)}
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-lg font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
