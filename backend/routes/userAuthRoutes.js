import express from 'express'
import { registerUser, loginUser, googleUserLogin, verifyEmailOtp } from '../controllers/userAuthController.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post("/register", authLimiter, registerUser)
router.post("/login", authLimiter, loginUser)
router.post("/verify-otp", authLimiter, verifyEmailOtp)
router.post("/google-login", authLimiter, googleUserLogin)

export default router