import React, { useState } from "react"
import { showSuccess, showError } from "../utils/alerts"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"
import Button from "../component/Button"
import Input from "../component/Input"

/**
 * ForgotPassword — Alden Clothing Timeless Editorial Luxury Forgot Password Page
 */
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
      await axiosInstance.post("/api/users/forgot-password", { email })
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
    <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center p-4 sm:p-6 font-sans text-[#30251F]">
      <div className="w-full max-w-md bg-[#FBF9F6] border border-[#DED4CB] rounded-[16px] p-8 sm:p-10 shadow-sm space-y-6">
        
        {/* Brand Editorial Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="text-3xl font-serif tracking-tight text-[#30251F] font-normal uppercase">
            ALDEN CLOTHING
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#76675D]">
            RECOVER YOUR ACCOUNT
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-center text-[#76675D]">
            Enter your registered email address below to receive a security OTP code.
          </p>

          <Input
            label="Registered Email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-xs text-[#8C2727] text-center font-semibold">{error}</p>}

          <Button
            variant="primary"
            fullWidth
            disabled={loading || !email}
            onClick={handleSendOtp}
            className="h-11"
          >
            {loading ? "SENDING OTP..." : "SEND OTP CODE"}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate("/login")}
            className="h-11"
          >
            CANCEL & RETURN TO LOGIN
          </Button>
        </div>

      </div>
    </div>
  )
}

export default ForgotPassword