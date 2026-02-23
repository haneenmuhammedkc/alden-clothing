import jwt from 'jsonwebtoken'
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"

const admin = {
  id: "admin123",
  email: "admin@gmail.com",
  password: "admin12"
}

export const adminLogin = (req, res) => {
  const { email, password } = req.body

  if (email !== admin.email || password !== admin.password) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    })
  }

  const adminToken = jwt.sign(
    { id: admin.id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.status(200).json({
    success: true,
    adminToken,
    admin: { email: admin.email }
  })
}

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } }, // adjust based on your schema
      { $group: { _id: null, total: { $sum: "$total" } } }
    ])
    const totalRevenue = revenueAgg[0]?.total || 0

    const totalProducts = await Product.countDocuments({ isDeleted: false })

    const totalUsers = await User.countDocuments()

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" })
  }
}

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })  // newest first
      .limit(10)                 // last 10 orders
      .select("customer total orderStatus createdAt")
    
    res.json(orders)
  } catch (error) {
    console.error("Recent orders error:", error)
    res.status(500).json({ message: "Failed to fetch recent orders" })
  }
}