import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js"
import admin from "../config/firebaseAdmin.js"

/* OTP Generator */
const generateOtp = () => { return Math.floor(100000 + Math.random() * 900000).toString() }

/* Register User */
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body

    // Validate User
    if (!name || !email || !password){
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      })}

    name = name.trim()
    email = email.trim().toLowerCase()

    // Check Existing User
    const existingUser = await User.findOne({ email })
    if (existingUser){
      return res.status(409).json({
        success: false,
        message: "User already exists"
      })}

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate OTP
    const otp = generateOtp()
    const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Create User (Not Verified)
    await User.create({ name, email, phone, password: hashedPassword, emailOtp: otp, emailOtpExpiry: otpExpiry, isVerified: false })

    // Send OTP Email
    await sendEmail( email,
      "Email Verification OTP",
      ` <h2>Welcome ${name}</h2>
        <p>Your email verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p> `
    )

    // Response
    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue."
    })

  } catch (error){
    res.status(500).json({
      success: false,
      message: error.message
    })}
}

/* Verify Email OTP */
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user){
      return res.status(400).json({
        success: false,
        message: "User not found"
      })}

    if (user.isVerified){
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      })}

    if (
      user.emailOtp !== otp ||
      user.emailOtpExpiry < Date.now()
    ){
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      })}

    // Mark verified
    user.isVerified = true
    user.emailOtp = undefined
    user.emailOtpExpiry = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login."
    })

  } catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    })}
}

/* User Login */
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body
    if (!email || !password){
      return res.status(400).json({
        success: false,
        message: "Please enter email and password"
      })}

    email = email.trim().toLowerCase()
    const user = await User.findOne({ email })
    if (!user){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })}

    // Block login if not verified
    if (!user.isVerified){
      return res.status(403).json({
        success: false,
        message: "Please verify your email using OTP"
      })}

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })}

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const googleUserLogin = async (req, res) => {
  try {
    const { token } = req.body

    const decoded = await admin.auth().verifyIdToken(token)
    const { email, name, picture } = decoded

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        isVerified: true,
        authProvider: "google"
      })
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })

    res.json({ token: jwtToken, user })
  } catch (err) {
  console.error("Google Verify Error:", err)
  res.status(401).json({ message: err.message || "Google login failed" })
}

}