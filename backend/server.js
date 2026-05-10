import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productImageRoutes from "./routes/productimages.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import { db } from "./config/db.js";

const app = express();

console.log("App starting...");

// ✅ 1. Trust proxy
app.set("trust proxy", 1);

// ✅ 2. Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ 3. CORS
app.use(
  cors({
    origin: [
      "https://an1meparadise.com",
      "https://www.an1meparadise.com",
      "http://localhost:8080",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options("*", cors());
app.options("/*path", cors());

// ✅ 4. Logger
app.use(morgan("dev"));

// ✅ 5. Body parser
app.use(express.json());

// ✅ 6. Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api", productImageRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", contactRoutes);
app.use("/api/user", userRoutes);
app.use("/api", paymentRoutes);

// ✅ Static folder
app.use("/uploads", express.static("uploads"));

// ✅ 7. Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ 8. 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ 9. Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ 10. Start Server (NO initDB needed)
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    // optional: test DB connection once
    await db.query("SELECT 1");
    console.log("✅ DB Pool Connected");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
});