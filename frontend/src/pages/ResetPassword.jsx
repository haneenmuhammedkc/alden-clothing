import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { showSuccess, showError } from "../utils/alerts"
import { Eye, EyeOff } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"
import Button from "../component/Button"
import Input from "../component/Input"

/**
 * ResetPassword — Alden Clothing Timeless Editorial Luxury Reset Password Page
 */
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

  useEffect(() => {
    if (!email) navigate("/forgot-password")
  }, [email, navigate])

  // OTP Resend Timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Password Strength Meter
  const getStrength = () => {
    if (newPassword.length < 6) return 20
    if (newPassword.length < 10) return 50
    return 100
  }

  // Password Reset Handler
  const handleReset = async () => {
    try {
      setLoading(true)
      setError("")

      await axiosInstance.post("/api/users/reset-password", {
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
    <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center p-4 sm:p-6 font-sans text-[#30251F]">
      <div className="w-full max-w-md bg-[#FBF9F6] border border-[#DED4CB] rounded-[16px] p-8 sm:p-10 shadow-sm space-y-6">
        
        {/* Brand Editorial Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="text-3xl font-serif tracking-tight text-[#30251F] font-normal uppercase">
            ALDEN CLOTHING
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#76675D]">
            SET NEW PASSWORD
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-center text-[#76675D]">
            Resetting password for <strong className="text-[#30251F]">{email}</strong>
          </p>

          <Input
            label="Enter OTP"
            placeholder="6-digit OTP code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <div className="relative">
            <Input
              label="New Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-8 text-[#76675D] hover:text-[#30251F] cursor-pointer"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-[#DED4CB] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    getStrength() === 100 ? "bg-[#2D5A27]" : getStrength() === 50 ? "bg-[#8B634B]" : "bg-[#8C2727]"
                  }`}
                  style={{ width: `${getStrength()}%` }}
                />
              </div>
              <p className="text-[10px] uppercase text-[#76675D] tracking-wider text-right font-semibold">
                STRENGTH: {getStrength() === 100 ? "STRONG" : getStrength() === 50 ? "MODERATE" : "WEAK"}
              </p>
            </div>
          )}

          {error && <p className="text-xs text-[#8C2727] text-center font-semibold">{error}</p>}

          <Button
            variant="primary"
            fullWidth
            disabled={loading || !otp || !newPassword}
            onClick={handleReset}
            className="h-11"
          >
            {loading ? "RESETTING..." : "RESET PASSWORD"}
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

export default ResetPassword