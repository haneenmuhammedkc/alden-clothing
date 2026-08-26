import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { getCart, addCart, clearCart } from "../controllers/cartController.js"

const router = express.Router()

// Get cart for authenticated user
router.get("/", authMiddleware(["user"]), getCart)

// Sync / Add items to cart
router.post("/add", authMiddleware(["user"]), addCart)

// Clear cart for authenticated user
router.delete("/clear", authMiddleware(["user"]), clearCart)

export default router