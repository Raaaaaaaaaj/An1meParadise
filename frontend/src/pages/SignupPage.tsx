import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const API_URL = import.meta.env.VITE_API_URL;
const SignupPage = () => {
  const [form, setForm] = useState({
    userName: "",
    userMail: "",
    userMobile: "",
    userCity: "",
    userPass: "",
    confirmPass: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ✅ handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // phone validation (only numbers)
    if (name === "userMobile" && !/^\d*$/.test(value)) return;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ✅ email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ password validation
  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);
  };

  // ✅ submit
  // ✅ handleSubmit function inside SignupPage (Updated)
const handleSubmit = async () => {
  setAlert(null);

  // Validation Logic (Same as before)
  if (!form.userName || !form.userMail || !form.userMobile || !form.userPass) {
    return setAlert({ type: "error", message: "Please fill all required fields" });
  }
  if (!isValidEmail(form.userMail)) {
    return setAlert({ type: "error", message: "Invalid email format" });
  }
  if (!validatePassword(form.userPass)) {
    return setAlert({
      type: "error",
      message: "Password must include uppercase, lowercase, number, special character and be at least 6 characters",
    });
  }
  if (form.userPass !== form.confirmPass) {
    return setAlert({ type: "error", message: "Passwords do not match" });
  }

  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: form.userName,
        userMail: form.userMail,
        userMobile: form.userMobile,
        userCity: form.userCity,
        userPass: form.userPass,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // ✅ Success Block
    // Signup par aksar token nahi milta (sirf login par), 
    // isliye optional chaining (?.) use kar rahe hain crash se bachne ke liye
    if (data.user) {
      localStorage.setItem("name", data.user.name);
      console.log("Saved Name:", data.user.name);
    }

    setAlert({ type: "success", message: data.message || "Account created successfully ✅" });

    // Clear form
    setForm({
      userName: "",
      userMail: "",
      userMobile: "",
      userCity: "",
      userPass: "",
      confirmPass: "",
    });

    // Optional: Redirect to login after success
    // setTimeout(() => navigate("/login"), 2000);

  } catch (error: any) {
    setAlert({ type: "error", message: error.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen pt-10 lg:pt-14">
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

              {/* 🔥 FLOATING ALERT (TOP RIGHT) */}
              {alert && (
                <div className="fixed top-5 right-5 z-50 w-[90%] max-w-sm">
                  <Alert
                    variant={alert.type === "error" ? "destructive" : "default"}
                    className={`shadow-lg animate-in fade-in slide-in-from-top-2 pr-10 ${alert.type === "error"
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "bg-green-50 border-green-300 text-green-700"
                      }`}
                  >
                    {/* ❌ Close Button */}
                    <button
                      onClick={() => setAlert(null)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
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
              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="Full Name"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary"
              />

              <input
                name="userMail"
                value={form.userMail}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary"
              />

              <input
                name="userMobile"
                value={form.userMobile}
                onChange={handleChange}
                placeholder="Phone"
                type="tel"
                maxLength={10}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary"
              />

              <input
                name="userCity"
                value={form.userCity}
                onChange={handleChange}
                placeholder="City"
                type="text"
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
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <input
                  name="confirmPass"
                  value={form.confirmPass}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  type={showConfirmPass ? "text" : "password"}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-neon py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Account"}
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