import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  createPromo,
  getPromos,
  deletePromo,
  togglePromo
} from "../controllers/adminPromoController.js"

const router = express.Router()

router.post("/", authMiddleware(["admin"]), createPromo)
router.get("/", authMiddleware(["admin"]), getPromos)
router.delete("/:id", authMiddleware(["admin"]), deletePromo)
router.patch("/:id/toggle", authMiddleware(["admin"]), togglePromo)

export default router