import express from "express"
import { getMyTransactions, getAllTransactions } from "../controllers/transactionController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/my", authMiddleware(["user"]), getMyTransactions)
router.get("/admin/all", authMiddleware(["admin"]), getAllTransactions)

export default router