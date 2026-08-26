import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addFeedback, getProductReviews, deleteFeedback } from "../controllers/feedbackUserController.js"

const router = express.Router()

router.post("/add", authMiddleware(["user"]), addFeedback)
router.get("/product/:productId", getProductReviews)
router.delete("/:id", authMiddleware(["user"]), deleteFeedback)

export default router