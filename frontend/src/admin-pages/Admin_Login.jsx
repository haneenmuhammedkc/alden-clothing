import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { showSuccess, showError, showInfo, showLoading } from "../utils/alerts"
import axiosInstance from "../utils/axiosInstance"
import Button from "../component/Button"
import Input from "../component/Input"

/**
 * Admin_Login — Alden Clothing Admin Authentication Portal
 * Background: #0F172A (Dark Slate Blue)
 */
const Admin_Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handlesubmit = async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      showInfo("Missing Fields", "Please fill all fields")
      return
    }
    try {
      setLoading(true)
      showLoading("Authenticating...")
      const response = await axiosInstance.post(
        "/api/admin/auth/a-login",
        { email, password }
      )
      Swal.close()
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.adminToken)
        await showSuccess(
          "Login Successful",
          "Redirecting to dashboard..."
        )
        navigate("/a-dash")
      } else {
        showError("Login Failed", response.data.message)
      }
    } catch (err) {
      Swal.close()
      showError("Login Failed", "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#8B634B] selection:text-white">
      <div className="w-full max-w-md bg-[#FFFFFF] text-[#30251F] border border-[#DED4CB] rounded-[16px] p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Admin Brand Header */}
        <div className="text-center space-y-1">
          <span className="font-sans font-bold text-sm tracking-[0.25em] text-[#8B634B] uppercase">
            ALDEN CLOTHING
          </span>
          <h1 className="text-2xl font-bold text-[#30251F] uppercase tracking-tight">
            ADMIN PORTAL ACCESS
          </h1>
          <p className="text-xs text-[#76675D]">
            Enter your administrative credentials to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handlesubmit} className="space-y-4 pt-2">
          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@aldenclothing.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="primary"
            fullWidth
            disabled={loading || !email || !password}
            type="submit"
            className="h-11 text-xs"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"}
          </Button>
        </form>

        <p className="text-[11px] text-center text-[#76675D] pt-2">
          Protected Administrative Workspace • Authorized Personnel Only
        </p>

      </div>
    </div>
  )
}

export default Admin_Login