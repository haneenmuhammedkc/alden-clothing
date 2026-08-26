import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { getWishlist, addWishlist, clearWishlist } from "../controllers/wishlistController.js"

const router = express.Router()

// Get wishlist for authenticated user
router.get("/", authMiddleware(["user"]), getWishlist)

// Save / Sync wishlist
router.post("/add", authMiddleware(["user"]), addWishlist)

// Clear wishlist for authenticated user
router.delete("/clear", authMiddleware(["user"]), clearWishlist)

export default router