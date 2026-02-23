import express from "express"
import { createPromo, getPromos, applyPromo, togglePromo } from "../controllers/promoController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// Only admin can create promos
router.post("/", authMiddleware(["admin"]), createPromo)

// Only admin should see full promo list
router.get("/", authMiddleware(["admin"]), getPromos)
router.patch("/:id/toggle", authMiddleware(["admin"]), togglePromo)

// User must be logged in to apply promo
router.post("/apply", authMiddleware(["user"]), applyPromo)

export default router