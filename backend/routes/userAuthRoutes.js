import express from 'express'
import { registerUser,loginUser, googleUserLogin } from '../controllers/userAuthController.js'
import { verifyEmailOtp } from '../controllers/userAuthController.js'

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/verify-otp", verifyEmailOtp)
router.post("/google-login", googleUserLogin)

export default router