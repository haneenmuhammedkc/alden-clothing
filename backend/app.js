import express from "express"
import cors from "cors"
import helmet from "helmet"
import { ServiceError } from "./services/serviceError.js"

import adminAuthRoutes from "./routes/adminAuthRoutes.js"
import adminProductRoutes from "./routes/adminProductRoutes.js"
import adminFeedbackRoutes from "./routes/adminFeedbackRoutes.js"
import adminCustomerRoutes from "./routes/adminCustomerRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"

import orderRoutes from "./routes/orderRoutes.js"
import userAuthRoutes from "./routes/userAuthRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import walletRoutes from "./routes/walletRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import feedbackUserRoutes from "./routes/feedbackUserRoutes.js"
import promoRoutes from "./routes/promoRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

const app = express()

// 🔒 Trust proxy configuration for reverse proxies (Render, Vercel, Nginx)
app.set("trust proxy", 1)

// 🔒 1. Helmet HTTP Security Headers Baseline
app.use(
  helmet({
    crossOriginResourcePolicy: false // Allows static uploads to be served across origins
  })
)

// 🔒 2. Explicit Request Body Payload Size Limits (SEC-MED-02)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// 🔒 3. Dynamic Environment-Driven CORS Configuration (SEC-HIGH-03)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : ["http://localhost:5173", "https://alden-clothing.vercel.app"]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error("CORS policy violation: Origin not allowed"), false)
    },
    credentials: true
  })
)

// 🟢 Standard Unauthenticated Health Check Endpoint (SEC-LOW-02)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString()
  })
})

// Route Registrations
app.use("/api/admin/auth", adminAuthRoutes)
app.use("/api/admin/products", adminProductRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin/categories", categoryRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/admin/feedback", adminFeedbackRoutes)
app.use("/api/admin", adminCustomerRoutes)

// Single Source of Truth for Promos (SEC-MED-01)
app.use("/api/admin/promos", promoRoutes)
app.use("/api/promos", promoRoutes)

// Static Upload Caching Headers (SEC-LOW-01)
app.use("/uploads", express.static("uploads", { maxAge: "1d" }))

app.use("/api/users", userAuthRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/feedback", feedbackUserRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/payment", paymentRoutes)

// 🟢 Centralized 404 Not Found Middleware (Mounted after all valid route registrations)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

// 🟢 Global Express Error Handling Middleware (4 arguments)
app.use((err, req, res, next) => {
  // 1. Payload Too Large (413)
  if (err.type === "entity.too.large" || err.status === 413 || err.statusCode === 413) {
    return res.status(413).json({
      success: false,
      message: "Payload too large"
    })
  }

  // 2. Malformed JSON / Body-Parser Errors
  if (
    err.type === "entity.parse.failed" ||
    (err instanceof SyntaxError && err.status === 400 && "body" in err)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid request payload"
    })
  }

  // 3. ServiceError & Custom Application Errors
  if (err instanceof ServiceError || (err.statusCode && err.message)) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    })
  }

  // 4. Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate resource"
    })
  }

  // 5. Mongoose ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation failed"
    })
  }

  // 6. CORS Policy Violation Error
  if (err.message && err.message.includes("CORS policy violation")) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }

  // 7. Generic / Unexpected Errors
  const isProduction = process.env.NODE_ENV === "production"
  if (!isProduction) {
    console.error("GLOBAL ERROR HANDLER:", err)
  }

  return res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: isProduction ? "Internal server error" : (err.message || "Internal server error")
  })
})

export default app