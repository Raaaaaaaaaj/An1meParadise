import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Package, MapPin, LogOut } from "lucide-react";

const AccountPage = () => {
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md">
          <h1 className="mb-8 text-center font-display text-3xl font-bold tracking-wider">MY ACCOUNT</h1>

          {/* Login Form - shown when not authenticated */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider">Sign In</h2>
              <div className="space-y-4">
                <input placeholder="Email" type="email" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <input placeholder="Password" type="password" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-gradient-neon py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground"
                >
                  Sign In
                </motion.button>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button className="text-primary hover:underline">Create one</button>
              </p>
            </div>

            {/* Quick Links */}
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
                    <p className="font-heading text-sm font-semibold">{item.label}</p>
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

export default AccountPage;
