import {
  registerCustomer,
  verifyCustomerEmailOtp,
  loginCustomer,
  googleCustomerLogin
} from "../services/authService.js"

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    const result = await registerCustomer({ name, email, password, phone })

    return res.status(201).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    console.error("User Registration Error:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const result = await verifyCustomerEmailOtp({ email, otp })

    return res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await loginCustomer({ email, password })

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}

export const googleUserLogin = async (req, res) => {
  try {
    const { token } = req.body
    const result = await googleCustomerLogin({ token })

    return res.json({
      token: result.token,
      user: result.user
    })
  } catch (err) {
    console.error("Google Verify Error:", err)
    const statusCode = err.statusCode || 401
    return res.status(statusCode).json({
      message: err.message || "Google login failed"
    })
  }
}