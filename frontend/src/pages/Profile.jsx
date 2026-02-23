import React, { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import { FiEdit, FiLogOut, FiLock, FiPackage, FiCreditCard, FiRepeat, FiX, FiChevronRight, FiUser, FiMail, FiPhone } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import AddressSection from "../component/AddressSection"
import { showConfirm, showSuccess } from "../utils/alerts"
import { motion, AnimatePresence } from "framer-motion"

const Profile = () => {
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({ name: "", phone: "", image: null })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [passwordError, setPasswordError] = useState("")

  // To Fetch Logged-In User Details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axios.get("http://localhost:4001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUser(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProfile()
  }, [])

  // To Ensure token exists before allowing profile access
  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if(!token){
      navigate("/login")
    }
  }, [])

  // To Change User Password
  const handleChangePassword = async () => {
    if(
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ){return setPasswordError("All fields are required")}

    if(passwordData.newPassword !== passwordData.confirmPassword){return setPasswordError("New passwords do not match")}
    if (passwordData.newPassword.length < 6) {return setPasswordError("Password must be at least 6 characters")}

    try {
      const token = localStorage.getItem("userToken")
      await axios.put(
        "http://localhost:4001/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setShowPasswordModal(false)
      alert("Password updated successfully")
    } catch(error){
      setPasswordError(
        error.response?.data?.message || "Failed to update password",
      )
    }
  }

  // To Upload Profile Image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    )
    const data = await res.json()
    if(!res.ok){
      throw new Error(data.error?.message || "Upload failed")
    }
    return data.secure_url
  }

  // For Edit Profile Details
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("userToken")
      let imageUrl = user?.profileImage || ""

      // Upload to cloudinary first
      if (editData.image) { imageUrl = await uploadImageToCloudinary(editData.image) }
      const res = await axios.put(
        "http://localhost:4001/api/users/me",
        { name: editData.name, phone: editData.phone, profileImage: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUser(res.data.user)
      setShowEditModal(false)
    } catch(err){
      console.error(err)
    }
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic">ACCOUNT.</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">Personal Terminal / Access Level 01</p>
            </div>
          </div>

          <div className="flex items-center gap-6">

            {/* Change Password Button */}
            <button onClick={() => {
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                setPasswordError("")
                setShowPasswordModal(true)
              }}
              className="group flex items-center gap-2 text-[10px] tracking-widest text-gray-400 hover:text-white transition-all cursor-pointer">
              <span className="group-hover:rotate-12 transition-transform"><FiLock /></span> CHANGE PASSWORD
            </button>
            <div className="h-4 w-px bg-white/10"></div>

            {/* Sign Out Button */}
            <button onClick={async () => { const result = await showConfirm( "Sign Out",
              "Are you sure you want to sign out of your account?" )
                if (result.isConfirmed) {
                  localStorage.removeItem("userToken")
                  showSuccess("Signed Out", "You have been logged out").then(() => {
                    navigate("/login", { replace: true })
                  })
                }
              }}
              className="group flex items-center gap-2 text-[10px] tracking-widest text-red-500 hover:text-red-400 transition-all cursor-pointer">
              <span className="group-hover:translate-x-1 transition-transform"><FiLogOut /></span> SIGN OUT
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Identity Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-white/3 border border-white/10 rounded-3xl p-8 group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <FiUser size={120} />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              
                {/* Profile Image */}
                <div className="relative group/avatar">
                  <div className="w-40 h-40 rounded-full bg-linear-to-b from-white to-gray-800 p-px">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <span className="text-4xl font-light tracking-widest">{getInitials(user?.name)}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => { setEditData({ name: user?.name || "", phone: user?.phone || "", image: null })
                      setShowEditModal(true)
                    }} className="absolute bottom-1 right-1 bg-white text-black p-3 rounded-full shadow-xl scale-0 cursor-pointer
                        group-hover/avatar:scale-100 transition-transform duration-300">
                    <FiEdit />
                  </button>
                </div>

                {/* User Details Section */}
                <div className="text-center md:text-left">

                  {/* UserName */}
                  <h2 className="text-3xl font-bold tracking-tight uppercase mb-4 leading-none">
                    {user?.name || "Initializing..."}
                  </h2>

                  {/* User Email and Phone */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                      <span className="text-white/40"><FiMail /></span>
                      <span className="text-xs tracking-wider">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                      <span className="text-white/40"><FiPhone /></span>
                      <span className="text-xs tracking-wider">{user?.phone || "No phone linked"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "ORDERS", icon: <FiPackage />, color: "white", path: "/myorder" },
                { label: "WALLET", icon: <FiCreditCard />, color: "white", path: "/wallet" },
                { label: "HISTORY", icon: <FiRepeat />, color: "white", path: "/transactions" },
              ].map((item, idx) => (
                <motion.button key={item.label} whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
                  onClick={() => navigate(item.path)}
                  className="bg-white/3 border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 transition-colors cursor-pointer">
                  <div className="text-2xl text-white/60">{item.icon}</div>
                  <span className="text-[10px] tracking-[0.3em] font-bold text-gray-400">{item.label}</span>
                  <span className="text-white/20 mt-2"><FiChevronRight /></span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Section (Address Section) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="col-span-4">
            <AddressSection />
          </motion.div>
        </div>
      </main>

      {/* Modals (Edit / ChangePassword) */}
      <AnimatePresence>
        {(showEditModal || showPasswordModal) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-100 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-4xl p-10 w-full max-w-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
              
              <button onClick={() => { setShowEditModal(false); setShowPasswordModal(false); }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer">
                <FiX size={24} />
              </button>

              {/* User Details Edit */}
              {showEditModal ? (
                <div className="space-y-8">
                  <header>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">Update Identity.</h3>
                    <p className="text-[10px] text-gray-500 tracking-[0.2em]">RE-ENSURING USER DETAILS</p>
                  </header>
                  
                  <div className="space-y-4">

                    {/* Name Section */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest text-gray-600 uppercase">User Name</label>
                      <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-white/40
                        focus:outline-none transition-all placeholder:text-gray-700"
                        placeholder="IDENTIFIER"/>
                    </div>

                    {/* Phone Section */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest text-gray-600 uppercase">User Phone</label>
                      <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-white/40
                        focus:outline-none transition-all placeholder:text-gray-700"
                        placeholder="PHONE_HASH"/>
                    </div>

                    {/* Image Section */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] tracking-widest text-gray-600 uppercase block mb-2">Image</label>
                      <input type="file" onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
                        className="text-[10px] text-gray-500 file:bg-white/10 file:text-white file:border-0 file:rounded-full
                        file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-white/20 transition-all"/>
                    </div>
                  </div>

                  {/* Action Buttons (cancel / save) */}
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 text-[10px] font-bold tracking-[0.3em] border
                      border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer">Cancel</button>
                    <button onClick={handleUpdateProfile} className="flex-1 py-4 text-[10px] font-bold tracking-[0.3em] bg-white
                      text-black rounded-xl hover:bg-gray-200 transition-all cursor-pointer">SAVE</button>
                  </div>
                </div>
              ) : (

                // Change Password Modal
                <div className="space-y-8">
                  <header>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">Access Key.</h3>
                    <p className="text-[10px] text-gray-500 tracking-[0.2em]">ENCRYPTING NEW CREDENTIALS</p>
                  </header>

                  <div className="space-y-4">
                    {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                      <input key={field} type="password" placeholder={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        value={passwordData[field]} onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-white/40
                        focus:outline-none transition-all placeholder:text-gray-700 text-sm"/>
                    ))}
                    {passwordError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] tracking-widest uppercase">
                        Error: {passwordError}
                      </motion.p>
                    )}
                  </div>

                  {/* Action Buttons (cancel / save) */}
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 text-[10px] font-bold tracking-[0.3em] 
                      border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer">CANCEL</button>
                    <button onClick={handleChangePassword} className="flex-1 py-4 text-[10px] font-bold tracking-[0.3em] bg-white
                      text-black rounded-xl hover:bg-gray-200 transition-all cursor-pointer">OVERWRITE</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Profile