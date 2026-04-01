import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, Package, MapPin, Eye, EyeOff } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
const API_URL = import.meta.env.VITE_API_URL;


const LoginPage = () => {
  const [form, setForm] = useState({
    userMail: "",
    userPass: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ✅ auto hide alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ✅ handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ submit
  const handleSubmit = async () => {
    setAlert(null);

    if (!form.userMail || !form.userPass) {
      return setAlert({ type: "error", message: "All fields required" });
    }

    if (!isValidEmail(form.userMail)) {
      return setAlert({ type: "error", message: "Invalid email format" });
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        // const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ save auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      console.log("✅ USER LOGGED IN");
      console.log("Token:", data.token);
      console.log("User:", data.user);
      console.log("LocalStorage:", {
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user"))
      });

      setAlert({ type: "success", message: "Login successful ✅" });

      // redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md"
        >
          <h1 className="mb-8 text-center font-display text-3xl font-bold tracking-wider">
            MY ACCOUNT
          </h1>

          {/* 🔥 FLOATING ALERT */}
          {alert && (
            <div className="fixed top-5 right-5 z-50 w-[90%] max-w-sm">
              <Alert
                className={`shadow-lg pr-10 ${alert.type === "error"
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-green-50 border-green-300 text-green-700"
                  }`}
              >
                <button
                  onClick={() => setAlert(null)}
                  className="absolute right-3 top-3"
                >
                  ✕
                </button>

                <AlertTitle>
                  {alert.type === "error" ? "Error" : "Success"}
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="space-y-6">
            {/* LOGIN CARD */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-primary">
                Sign In
              </h2>

              <div className="space-y-4">
                {/* EMAIL */}
                <input
                  name="userMail"
                  value={form.userMail}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary"
                />

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    name="userPass"
                    value={form.userPass}
                    onChange={handleChange}
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* BUTTON */}
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-neon py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </motion.button>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="space-y-2">
              {[
                { icon: User, label: "Profile", desc: "Manage your account details" },
                { icon: Package, label: "Orders", desc: "Track your order history" },
                { icon: MapPin, label: "Addresses", desc: "Manage saved addresses" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;