import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isAdminAuthenticated,
  saveAdminSession,
} from "@/admin/routes/adminAuth";

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Admin Login | AN1ME Paradise";
  }, []);

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Admin email and password are required.");
      return;
    }

    // Static credentials for demonstration purposes
    const ADMIN_EMAIL = "workwithan1me.paradise@gmail.com";
    const ADMIN_PASSWORD = "An1meParadise@2026@gmail.com";

    if (form.email.trim() !== ADMIN_EMAIL || form.password !== ADMIN_PASSWORD) {
      setError("Invalid admin credentials");
      return;
    }

    setLoading(true);
    saveAdminSession(form.email.trim());

    const fallbackPath = "/admin/dashboard";
    const from = location.state?.from?.pathname?.startsWith("/admin")
      ? location.state.from.pathname
      : fallbackPath;

    window.setTimeout(() => {
      setLoading(false);
      navigate(from, { replace: true });
    }, 350);
  };

  return (
    <div className="admin-crm grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_28rem]">
      <section className="relative hidden border-r border-border bg-card lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(0_0%_100%/0.14),transparent_34%),linear-gradient(145deg,hsl(0_0%_12%),hsl(0_0%_0%))]" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <img
            src="/logo2.png"
            alt="AN1ME PARADISE"
            className="h-24 w-fit object-contain"
          />
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Owner Workspace
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-tight tracking-wider">
              STORE CRM
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Manage users, catalog, tags, orders, and contacts from one
              protected admin surface.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            AN1ME Paradise Admin Panel
          </p>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl"
        >
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background">
              <LockKeyhole className="h-5 w-5 text-primary" />
            </div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Protected Route
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-wider">
              Admin Login
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="owner@an1meparadise.in"
                className="border-border bg-background"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter admin password"
                  className="border-border bg-background pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </motion.form>
      </main>
    </div>
  );
};

export default AdminLoginPage;
