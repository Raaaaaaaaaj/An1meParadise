const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

// ✅ 1. Trust proxy (important for hosting like Hostinger)
app.set("trust proxy", 1);

// ✅ 2. Security middleware
app.use(helmet());

// ✅ 3. CORS config
app.use(cors({
  origin: [
    "https://an1meparadise.com",
    "https://www.an1meparadise.com",
    "http://localhost:8080"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ 4. Logger (debugging)
app.use(morgan("dev"));

// ✅ 5. Body parser
app.use(express.json());

// ✅ 6. Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// ✅ 7. Health check route (important for testing)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ 8. 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ 9. Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ 10. Port config (dynamic for hosting)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});