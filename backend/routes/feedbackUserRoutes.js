import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addFeedback, getProductReviews } from "../controllers/feedbackUserController.js"

const router = express.Router()

router.post("/add", authMiddleware(["user"]), addFeedback)
router.get("/product/:productId", getProductReviews)

export default router