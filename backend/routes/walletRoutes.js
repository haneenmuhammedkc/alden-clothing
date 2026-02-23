import express from 'express'
import { getWallet, creditWallet, debitWallet } from '../controllers/walletController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", authMiddleware(["user"]), getWallet)
router.post("/credit", authMiddleware(["user"]), creditWallet)
router.post("/debit", authMiddleware(["user"]), debitWallet)

export default router