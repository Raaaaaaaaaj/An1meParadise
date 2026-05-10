import { useState, useEffect, useRef } from "react";
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const name = localStorage.getItem("name");
  //   // const name = localStorage.getItem("user.userName");



  //   if (token) {
  //     setIsLoggedIn(true);

  //     if (name) {
  //       const words = name.split(" ");
  //       const initials = words.map(w => w[0]).join("").toUpperCase();
  //       setInitials(initials);
  //     }
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token && token !== "null" && token !== "undefined") {
      setIsLoggedIn(true);

      if (name) {
        const words = name.split(" ");
        const initials = words.map(w => w[0]).join("").toUpperCase();
        setInitials(initials);
      }
    } else {
      setIsLoggedIn(false);
      setInitials(""); // reset bhi karo
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setInitials("");

    // window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsLoggedIn(true);

      if (user.name) {
        console.log(`Logges in and as ${user.name}`);
        const words = user.name.split(" ");
        const initials = words.map(w => w[0]).join("").toUpperCase();
        setInitials(initials);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo2.png"
            alt="AN1ME PARADISE"
            className="h-20 w-auto lg:h-24 object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-heading text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/shop" className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground">
            {/* <Search className="h-5 w-5" /> */}
          </Link>
          <Link to="/wishlist" className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground sm:block">
            <Heart className="h-5 w-5" />
          </Link>

          {/* user */}

          {/* <Link to="/signup" className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground sm:block">
            <User className="h-5 w-5" />
          </Link> */}


          <div className="relative" ref={dropdownRef}>

            {/* ICON / INITIALS */}
            <button
              onClick={() => setOpen(!open)}
              className="hidden sm:flex items-center justify-center rounded-full p-[2px] bg-gradient-to-r from-gray-300 to-gray-500 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-gray-800 shadow-md">
                {isLoggedIn ? (
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {initials}
                  </span>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">

                {!isLoggedIn ? (
                  <div className="p-2">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-black hover:text-white transition-all duration-200"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-base">🔐</span>
                      Sign-up / Log-in
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* TOP SECTION */}
                    <div className="px-4 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-center gap-3">

                        <div className="h-11 w-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm uppercase shadow-md">
                          {initials}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Welcome 👋
                          </p>

                          <p className="text-xs text-gray-500">
                            Manage your account
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MENU ITEMS */}
                    <div className="p-2">

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-black hover:text-white transition-all duration-200"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-base">👤</span>
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                      >
                        <span className="text-base">🚪</span>
                        Log-out
                      </button>

                    </div>
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
              {/* Navigation Links */}
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

              <hr className="border-border/50 my-2" />

              {/* Mobile User Actions */}
              <div className="flex flex-col gap-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-1">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {initials}
                      </div>
                      <span className="font-medium text-foreground">My Account</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="text-left text-red-500 hover:text-red-600"
                    >
                      Log-out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <User className="h-5 w-5" />
                    <span>Sign-up / Log-in</span>
                  </Link>
                )}

                {/* Wishlist for Mobile */}
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
