
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js"
import productImageRoutes from "./routes/productimages.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { initDB } from "./config/db.js";

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
app.use(cors({
  origin: [
    "https://an1meparadise.com",
    "https://www.an1meparadise.com",
    "http://localhost:8080"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ 4. Logger
app.use(morgan("dev"));

// ✅ 5. Body parser  
app.use(express.json());

// ✅ 6. Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/categories", categoriesRoutes)
app.use("/api", productImageRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", contactRoutes);

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

// ✅ 10. Server start (initialize DB first)
const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize DB. Exiting.", err);
    process.exit(1);
  });