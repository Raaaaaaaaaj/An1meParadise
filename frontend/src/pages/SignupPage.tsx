import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SignupPage = () => {
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md"
        >
          <h1 className="mb-8 text-center font-display text-3xl font-bold tracking-wider">
            CREATE ACCOUNT
          </h1>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-primary">
              Sign Up
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Full Name"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              <input
                placeholder="Email"
                type="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              <input
                placeholder="Phone"
                type="tel"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              <input
                placeholder="City"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              <input
                placeholder="Password"
                type="password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              <input
                placeholder="Confirm Password"
                type="password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl bg-gradient-neon py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                Create Account
              </motion.button>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;