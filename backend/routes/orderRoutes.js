import express from "express"
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus, getOrderById, cancelOrder, getSalesReport } from "../controllers/orderController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// Create Order (protected)
router.post("/", authMiddleware(["user"]), createOrder)
router.get("/", authMiddleware(["admin"]), getAllOrders)
router.get("/sales-report", authMiddleware(["admin"]), getSalesReport)
router.put("/:id/status", authMiddleware(["admin"]), updateOrderStatus)
router.get("/my", authMiddleware(["user"]), getMyOrders)
router.get("/:id", authMiddleware(["user","admin"]), getOrderById)
router.put("/:id/cancel", authMiddleware(["user"]), cancelOrder)

export default router