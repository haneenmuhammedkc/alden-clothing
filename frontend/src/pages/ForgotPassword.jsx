import React, { useState } from "react"
import axios from "axios"
import { showSuccess, showError } from "../utils/alerts"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email")
      return
    }

    try {
      setLoading(true)
      setError("")
      await axios.post("http://localhost:4001/api/users/forgot-password", { email })
      showSuccess("OTP Sent", "Check your email")
      navigate("/reset-password", { state: { email } })
    } catch (err) {
      showError("Error", err.response?.data?.message || "Failed to send OTP")
      setError(err.response?.data?.message || "Failed to send OTP")
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="text-xs text-center text-gray-500">
          Enter your registered email to receive OTP
        </p>

        {/* Email Input */}
        <div className="relative">
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            className="peer w-full px-4 pt-5 pb-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
            placeholder=" " />
          <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm transition-all">
            Registered Email
          </label>
        </div>

        {/* Inline Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex flex-col gap-2">
          <button onClick={handleSendOtp} disabled={loading}
            className="w-full bg-black text-white py-2 rounded-full hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 hover:scale-[1.02]">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <button onClick={() => navigate("/login")}
            className="w-full border border-black py-2 rounded-full hover:bg-black hover:text-white transition">
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

export default ForgotPassword