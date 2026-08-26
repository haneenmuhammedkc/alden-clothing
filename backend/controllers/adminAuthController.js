import {
  loginAdmin,
  fetchDashboardStats,
  fetchRecentOrders
} from "../services/adminAuthService.js"

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const data = await loginAdmin({ email, password })

    return res.status(200).json({
      success: true,
      adminToken: data.adminToken,
      admin: data.admin
    })
  } catch (err) {
    console.error("Admin Login Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Authentication failed"
    })
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await fetchDashboardStats()
    return res.json(stats)
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message || "Failed to load dashboard stats" })
  }
}

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await fetchRecentOrders()
    return res.json(orders)
  } catch (error) {
    console.error("Recent orders error:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message || "Failed to fetch recent orders" })
  }
}