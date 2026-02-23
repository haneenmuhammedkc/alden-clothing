import React, { useState } from "react"
import { assets } from "../assets/assets"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { showSuccess, showError, showInfo, showLoading } from "../utils/alerts"

const Admin_Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const handlesubmit = async () => {
    if (!email || !password) {
      showInfo("Missing Fields", "Please fill all fields")
      return
    }
    try {
      setLoading(true)
      showLoading("Authenticating...")
      const response = await axios.post(
        "http://localhost:4001/api/admin/auth/a-login",
        { email, password }
      )
      Swal.close() // close loading
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.adminToken)
        await showSuccess(
          "Login Successful",
          "Redirecting to dashboard..."
        )
        setFadeOut(true)
        setTimeout(() => {
          navigate("/a-dash")
        }, 500)
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
    <div className={`w-full h-screen flex bg-gray-100 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>

      {/* Left Branding Section */}
      <div className="hidden md:flex w-1/2 relative">
        <img src={assets.login_image} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-10">
          <h1 className="text-4xl font-bold tracking-widest mb-4">ADMIN PANEL</h1>
          <p className="text-sm opacity-80 text-center max-w-md">
            Manage products, customers, orders, and analytics securely from one dashboard.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 animate-fadeIn">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 text-sm mb-8"> Login to continue as admin </p>

          {/* Email Input */}
          <div className="mb-3">
            <label className="text-xs text-gray-500">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 outline-none focus:border-black transition"/>
          </div>

          {/* Password Input */}
          <div className="mb-7">
            <label className="text-xs text-gray-500">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 outline-none focus:border-black transition"/>
          </div>

          {/* Login Button */}
          <button onClick={handlesubmit} disabled={loading} className={`w-full py-3 rounded-lg text-white font-medium
            transition-all duration-300 transform ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 active:translate-y-0 active:shadow-sm"
            }`}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default Admin_Login