import React, { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { showSuccess, showError } from "../utils/alerts"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

const ResetPassword = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const email = state?.email

  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(45)
  const [canResend, setCanResend] = useState(false)

  if (!email) navigate("/forgot-password")

  // OTP Timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Password Strength
  const getStrength = () => {
    if (newPassword.length < 6) return 20
    if (newPassword.length < 10) return 50
    return 100
  }

  const handleReset = async () => {
    try {
      setLoading(true)
      setError("")

      await axios.post("http://localhost:4001/api/users/reset-password", {
        email,
        otp,
        newPassword
      })

      showSuccess("Success", "Password reset successful")
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed")
      showError("Failed", err.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-100 bg-white rounded-2xl shadow-2xl p-8 space-y-5 animate-fade-in">

        {/* Brand */}
        <div className="text-center">
          <p className="text-xs text-gray-400">Secure your account</p>
        </div>

        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-xs text-center text-gray-500">For: {email}</p>

        {/* OTP Input */}
        <div className="relative">
          <input value={otp} onChange={(e) => setOtp(e.target.value)}
            className="peer w-full px-4 pt-5 pb-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
            placeholder=" " />
          <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm transition-all">
            Enter OTP
          </label>
        </div>

        {/* Password Input */}
        <div className="relative">
          <input type={showPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="peer w-full px-4 pt-5 pb-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
            placeholder=" "/>
          <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm transition-all">
            New Password
          </label>
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {/* Strength Meter */}
        <div className="h-1 bg-gray-200 rounded">
          <div className={`h-full rounded transition-all ${
            getStrength() === 100 ? "bg-green-500" : getStrength() === 50 ? "bg-yellow-400" : "bg-red-400"}`}
            style={{ width: `${getStrength()}%` }}/>
        </div>

        {/* Inline Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Reset Button */}
        <button onClick={handleReset} disabled={loading}
          className="w-full bg-black text-white py-2 rounded-full hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 hover:scale-[1.02]">
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Cancel */}
        <button onClick={() => navigate("/login")}
          className="w-full border border-black py-2 rounded-full hover:bg-black hover:text-white transition">
          Cancel
        </button>

      </div>
    </div>
  )
}

export default ResetPassword