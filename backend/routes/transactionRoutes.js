import express from "express"
import { getMyTransactions } from "../controllers/transactionController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/my", authMiddleware(["user"]), getMyTransactions)

export default router