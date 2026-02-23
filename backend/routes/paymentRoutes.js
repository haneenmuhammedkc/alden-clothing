import express from 'express'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/razorpay/create-order", authMiddleware(["user"]), createRazorpayOrder)
router.post("/razorpay/verify", authMiddleware(["user"]), verifyRazorpayPayment)

export default router