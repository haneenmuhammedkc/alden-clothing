import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
import User from "../models/User.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { ServiceError } from "./serviceError.js"
import { validateAdminLoginInput } from "../validators/adminAuthValidators.js"

export const loginAdmin = async ({ email, password }) => {
  const validation = validateAdminLoginInput({ email, password })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedEmail = String(email).toLowerCase().trim()

  // 🔒 1. Query Admin document from MongoDB with password explicitly selected
  let adminDoc = await Admin.findOne({ email: normalizedEmail }).select("+password")

  // 🔒 1b. Bootstrap Fallback: If zero admin documents exist in DB, create initial admin from env / default
  if (!adminDoc) {
    const count = await Admin.countDocuments()
    if (count === 0) {
      const bootstrapEmail = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase().trim()
      const bootstrapPassword = process.env.ADMIN_PASSWORD || "admin12"
      const bootstrapName = process.env.ADMIN_NAME || "System Admin"

      if (normalizedEmail === bootstrapEmail) {
        adminDoc = await Admin.create({
          name: bootstrapName,
          email: bootstrapEmail,
          password: bootstrapPassword,
          role: "admin",
          status: "Active"
        })
        adminDoc = await Admin.findById(adminDoc._id).select("+password")
      }
    }
  }

  if (!adminDoc) {
    throw new ServiceError("Invalid credentials", 401)
  }

  // 🔒 2. Check Blocked status
  if (adminDoc.status === "Blocked") {
    throw new ServiceError("Account blocked by system administrator", 403)
  }

  // 🔒 3. Verify bcrypt password match via model method
  const isMatch = await adminDoc.comparePassword(password)
  if (!isMatch) {
    throw new ServiceError("Invalid credentials", 401)
  }

  // 🔒 4. Issue JWT with admin ID and role contract
  const adminToken = jwt.sign(
    { id: adminDoc._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return {
    adminToken,
    admin: {
      id: adminDoc._id,
      name: adminDoc.name,
      email: adminDoc.email
    }
  }
}

export const fetchDashboardStats = async () => {
  const totalOrders = await Order.countDocuments()

  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ])
  const totalRevenue = revenueAgg[0]?.total || 0

  const totalProducts = await Product.countDocuments({ isDeleted: false })
  const totalUsers = await User.countDocuments()

  return {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers
  }
}

export const fetchRecentOrders = async () => {
  return await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("customer total orderStatus createdAt")
}
