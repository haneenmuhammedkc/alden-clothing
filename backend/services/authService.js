import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js"
import {
  getVerificationEmailTemplate,
  getResetPasswordEmailTemplate
} from "../utils/emailTemplates.js"
import admin from "../config/firebaseAdmin.js"
import { generateSixDigitOtp } from "../utils/otpUtils.js"
import { ServiceError } from "./serviceError.js"
import {
  validateRegisterInput,
  validateVerifyOtpInput,
  validateLoginInput,
  validateGoogleLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput
} from "../validators/authValidators.js"

export const registerCustomer = async ({ name, email, password, phone }) => {
  const validation = validateRegisterInput({ name, email, password, phone })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()

  const existingUser = await User.findOne({ email: normalizedEmail })
  if (existingUser) {
    throw new ServiceError("User already exists", 409)
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const otp = generateSixDigitOtp()
  const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

  await User.create({
    name: normalizedName,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    emailOtp: otp,
    emailOtpExpiry: otpExpiry,
    isVerified: false
  })

  const { subject, html } = getVerificationEmailTemplate({
    name: normalizedName,
    otp
  })

  await sendEmail(normalizedEmail, subject, html)

  return { message: "OTP sent to your email. Please verify to continue." }
}

export const verifyCustomerEmailOtp = async ({ email, otp }) => {
  const validation = validateVerifyOtpInput({ email, otp })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail }).select("+emailOtp +emailOtpExpiry")

  if (!user) {
    throw new ServiceError("User not found", 400)
  }

  if (user.isVerified) {
    throw new ServiceError("Email already verified", 400)
  }

  if (user.emailOtp !== otp || user.emailOtpExpiry < Date.now()) {
    throw new ServiceError("Invalid or expired OTP", 400)
  }

  user.isVerified = true
  user.emailOtp = undefined
  user.emailOtpExpiry = undefined
  await user.save()

  return { message: "Email verified successfully. You can now login." }
}

export const loginCustomer = async ({ email, password }) => {
  const validation = validateLoginInput({ email, password })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail }).select("+password")

  if (!user) {
    throw new ServiceError("Invalid email or password", 401)
  }

  if (user.status === "Blocked") {
    throw new ServiceError("Your account has been blocked by an administrator", 403)
  }

  if (!user.isVerified) {
    throw new ServiceError("Please verify your email using OTP", 403)
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new ServiceError("Invalid email or password", 401)
  }

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  }
}

export const googleCustomerLogin = async ({ token }) => {
  const validation = validateGoogleLoginInput({ token })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  let decoded
  try {
    decoded = await admin.auth().verifyIdToken(token)
  } catch (err) {
    throw new ServiceError(err.message || "Google login failed", 401)
  }

  const { email, name, picture } = decoded
  let user = await User.findOne({ email })

  if (user && user.status === "Blocked") {
    throw new ServiceError("Your account has been blocked by an administrator", 403)
  }

  if (!user) {
    user = await User.create({
      name,
      email,
      profileImage: picture,
      isVerified: true,
      authProvider: "google"
    })
  }

  // 🔒 Standardized JWT payload including role: "user"
  const jwtToken = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return { token: jwtToken, user }
}

export const forgotCustomerPassword = async ({ email }) => {
  const validation = validateForgotPasswordInput({ email })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  const otp = generateSixDigitOtp()
  user.resetOtp = otp
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000
  await user.save()

  const { subject, html } = getResetPasswordEmailTemplate({ otp })

  await sendEmail(normalizedEmail, subject, html)

  return { message: "OTP sent successfully" }
}

export const resetCustomerPassword = async ({ email, otp, newPassword }) => {
  const validation = validateResetPasswordInput({ email, otp, newPassword })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({
    email: normalizedEmail,
    resetOtp: otp,
    resetOtpExpire: { $gt: Date.now() }
  }).select("+resetOtp +resetOtpExpire")

  if (!user) {
    throw new ServiceError("Invalid or expired OTP", 400)
  }

  user.password = await bcrypt.hash(newPassword, 10)
  user.resetOtp = null
  user.resetOtpExpire = null
  await user.save()

  return { message: "Password reset successful" }
}
