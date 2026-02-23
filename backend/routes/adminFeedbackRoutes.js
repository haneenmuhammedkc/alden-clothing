import express from "express"
import { getAllFeedbacks, resolveFeedback } from "../controllers/adminFeedbackController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware(["admin"]), getAllFeedbacks)
router.put("/:id/resolve", authMiddleware(["admin"]), resolveFeedback)

export default router