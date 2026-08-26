import express from "express"
import { adminLogin, getDashboardStats, getRecentOrders } from "../controllers/adminAuthController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import { authLimiter } from "../middleware/rateLimiter.js"

const router = express.Router()

router.post("/a-login", authLimiter, adminLogin)
router.get("/dashboard-stats", authMiddleware(["admin"]), getDashboardStats)
router.get("/recent-orders", authMiddleware(["admin"]), getRecentOrders)

export default router