import React, { useState } from "react"
import axios from "axios"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate, useLocation } from "react-router-dom"
import { showSuccess, showError, showInfo } from "../utils/alerts"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../firebase"

const User_Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  const [isRegister, setIsRegister] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "" })
  const [otp, setOtp] = useState("")
  const [otpEmail, setOtpEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    try {
      setLoading(true)
      setError("")

      await axios.post("http://localhost:4001/api/users/register", registerData)

      showInfo("OTP Sent", "Please check your email 📧")

      setOtpEmail(registerData.email)
      setShowOtp(true)
      setIsRegister(true)

    } catch (err) {
      showError("Registration Failed", err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      setLoading(true)
      setError("")

      await axios.post("http://localhost:4001/api/users/verify-otp", { email: otpEmail, otp })

      showSuccess("Verified", "Your email has been verified successfully")

      setOtp("")
      setShowOtp(false)
      setIsRegister(false)

    } catch (err) {
      showError("Verification Failed", err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await axios.post("http://localhost:4001/api/users/login", loginData)

      localStorage.setItem("userToken", res.data.token)

      showSuccess("Welcome Back", "You're logged into Alden").then(() => {
        navigate(from, { replace: true })
      })

    } catch (err) {
      showError("Login Failed", err.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const token = await user.getIdToken()
      console.log("Google Firebase Token:", token) // debug

      const res = await axios.post("http://localhost:4001/api/users/google-login", { token })

      localStorage.setItem("userToken", res.data.token)

      showSuccess("Welcome", "Logged in with Google").then(() => {
        navigate(from, { replace: true })
      })

    } catch (err) {
      console.error("Google Login Error:", err)
      showError(
        "Google Login Failed",
        err.response?.data?.message || err.message || "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">

      <div className="w-225 h-120 bg-white rounded-[30px] shadow-xl overflow-hidden">

        <div className={`flex w-[200%] h-full transition-transform duration-1000 ${isRegister ? "-translate-x-1/2" : "translate-x-0"}`}>

          {/* Login Section */}
          <div className="w-1/2 h-full flex">

            {/* Leftside - Form */}
            <div className="w-[60%] h-full flex flex-col items-center justify-center gap-4 px-10 bg-white">
              <h2 className="text-3xl font-bold">Sign In</h2>

              <input placeholder="Enter your Email" value={loginData.email} onChange={(e) =>setLoginData({ ...loginData, email: e.target.value })}
                className="w-full max-w-xs focus:ring-1 focus:ring-black/50 focus:bg-white bg-gray-100 px-4 py-2 rounded outline-none"/>
              <div className="relative w-full max-w-xs">
                <input type={showLoginPassword ? "text" : "password"} placeholder="Enter your Password" value={loginData.password}
                  onChange={(e) =>setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full focus:ring-1 focus:ring-black/50 focus:bg-white bg-gray-100 px-4 py-2 pr-10 rounded outline-none"/>
                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black cursor-pointer hover:scale-110 transition-transform">
                    {showLoginPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              <button onClick={handleLogin} disabled={loading} className="text-white bg-black px-8 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black hover:border hover:border-black transition duration-500"> {loading ? "Logging in..." : "Login"} </button>
              <p onClick={() => navigate("/forgot-password")}
                className="text-xs text-black/60 hover:text-black cursor-pointer transition">
                Forgotten your password ?
              </p>
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full max-w-xs border border-gray-300 py-2 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            </div>

            {/* Rightside - Black Panel */}
            <div className="w-[40%] h-full bg-[#0b0b0b] text-white flex flex-col items-center justify-center gap-4 px-10">
              <h2 className="text-3xl font-bold">New Here?</h2>
              <p className="text-sm opacity-80 text-center">Create an account for a personalized shopping experience.</p>
              <button onClick={() => setIsRegister(true)}
                className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer">
                Sign Up
              </button>
            </div>

          </div>

          {/* Register / Otp Section */}
          <div className="w-1/2 h-full flex">
            <div className="w-[40%] bg-black text-white flex flex-col items-center justify-center gap-4">
              <h2 className="text-3xl font-bold">Welcome Back!</h2>
              <p className="text-sm opacity-80 text-center">Sign in to continue shopping !</p>
              <button onClick={() => { setIsRegister(false), setShowOtp(false)}}
                className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer">
                Sign In
              </button>
            </div>

            <div className="w-[60%] h-full flex flex-col items-center justify-center gap-4 px-10">

              {!showOtp ? (
                <>
                  <h2 className="text-3xl font-bold">Create Account</h2>

                  <input placeholder="Name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full max-w-xs bg-gray-100 px-4 py-2 rounded"/>

                  <input placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full max-w-xs bg-gray-100 px-4 py-2 rounded"/>

                  <input placeholder="Phone" value={registerData.phone} onChange={(e) =>setRegisterData({ ...registerData, phone: e.target.value })}
                    className="w-full max-w-xs bg-gray-100 px-4 py-2 rounded"/>

                  <div className="relative w-full max-w-xs">
                    <input type={showRegisterPassword ? "text" : "password"} placeholder="Password" value={registerData.password}
                      onChange={(e) =>setRegisterData({...registerData, password: e.target.value})}
                      className="w-full bg-gray-100 px-4 py-2 pr-10 rounded"/>

                    <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showRegisterPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </button>
                  </div>
                  <button onClick={handleRegister} disabled={loading} className="text-white bg-black px-8 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black hover:border hover:border-black transition duration-500">
                    {loading ? "Registering..." : "Register"}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">Verify Email</h2>
                  <p className="text-sm text-center text-black/60"> Enter the OTP sent to <br />
                    <strong>{otpEmail}</strong>
                  </p>

                  <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="Enter OTP"
                    className="w-full max-w-xs text-center tracking-widest bg-gray-100 px-4 py-2 rounded"/>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button onClick={handleVerifyOtp} disabled={loading} className="bg-black text-white px-8 py-2 rounded-full cursor-pointer hover:bg-white hover:border hover:border-black hover:text-black">
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default User_Login