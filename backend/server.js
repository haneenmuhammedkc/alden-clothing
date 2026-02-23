import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/database.js'

import adminAuthRoutes from './routes/adminAuthRoutes.js'
import adminProductRoutes from './routes/adminProductRoutes.js'
import adminFeedbackRoutes from "./routes/adminFeedbackRoutes.js"
import adminCustomerRoutes from "./routes/adminCustomerRoutes.js"
import adminPromoRoutes from "./routes/adminPromoRoutes.js"
import categoryRoutes from './routes/categoryRoutes.js'

import orderRoutes from './routes/orderRoutes.js'
import userAuthRoutes from './routes/userAuthRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import feedbackUserRoutes from "./routes/feedbackUserRoutes.js"
import promoRoutes from "./routes/promoRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

connectDB()

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
)

const Port = process.env.PORT

app.use("/api/admin/auth", adminAuthRoutes)
app.use("/api/admin/products", adminProductRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin/categories", categoryRoutes)
app.use("/api/admin/feedback", adminFeedbackRoutes)
app.use("/api/admin", adminCustomerRoutes)
app.use("/api/admin/promos", adminPromoRoutes)
app.use("/uploads", express.static("uploads"))

app.use("/api/users", userAuthRoutes)
app.use("/api/users", userRoutes)  
app.use("/api/products", productRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/feedback", feedbackUserRoutes)
app.use("/api/promos", promoRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/payment", paymentRoutes)

app.listen(Port,() => {
    console.log(`Server is Running at Port ${Port}`)
})