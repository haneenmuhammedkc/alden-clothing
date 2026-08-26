import express from "express"
import { getAllFeedbacks, resolveFeedback, deleteFeedbackAdmin } from "../controllers/adminFeedbackController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware(["admin"]), getAllFeedbacks)
router.put("/:id/resolve", authMiddleware(["admin"]), resolveFeedback)
router.delete("/:id", authMiddleware(["admin"]), deleteFeedbackAdmin)

export default router