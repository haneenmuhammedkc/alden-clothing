import React, { useState, useEffect } from "react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Button from "../component/Button"
import Input from "../component/Input"
import Modal from "../component/Modal"
import AddressSection from "../component/AddressSection"
import { Edit, LogOut, Lock, Package, CreditCard, Repeat, Mail, Phone, User as UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { showConfirm, showSuccess } from "../utils/alerts"
import axiosInstance from "../utils/axiosInstance"

/**
 * Profile — Alden Clothing Timeless Editorial Luxury Customer Profile Workspace
 * 2-column desktop workspace (Identity & Navigation on left, Addresses on right).
 */
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

  // Fetch Logged-In User Details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axiosInstance.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProfile()
  }, [])

  // Check auth token
  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  // Change Password Handler
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return setPasswordError("All fields are required")
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError("New passwords do not match")
    }
    if (passwordData.newPassword.length < 6) {
      return setPasswordError("Password must be at least 6 characters")
    }

    try {
      const token = localStorage.getItem("userToken")
      await axiosInstance.put(
        "/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowPasswordModal(false)
      alert("Password updated successfully")
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Failed to update password")
    }
  }

  // Upload Profile Image to Cloudinary
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
    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed")
    }
    return data.secure_url
  }

  // Update Profile Details Handler
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("userToken")
      let imageUrl = user?.profileImage || ""

      if (editData.image) {
        imageUrl = await uploadImageToCloudinary(editData.image)
      }
      const res = await axiosInstance.put(
        "/api/users/me",
        { name: editData.name, phone: editData.phone, profileImage: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(res.data.user)
      setShowEditModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#DED4CB]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
              ACCOUNT DASHBOARD
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
              CUSTOMER PROFILE
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                setPasswordError("")
                setShowPasswordModal(true)
              }}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#76675D] hover:text-[#30251F] transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#8B634B]" />
              <span>CHANGE PASSWORD</span>
            </button>

            <span className="text-[#DED4CB]">|</span>

            <button
              type="button"
              onClick={async () => {
                const result = await showConfirm(
                  "Sign Out",
                  "Are you sure you want to sign out of your account?"
                )
                if (result.isConfirmed) {
                  localStorage.removeItem("userToken")
                  showSuccess("Signed Out", "You have been logged out").then(() => {
                    navigate("/login", { replace: true })
                  })
                }
              }}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#8C2727] hover:underline cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 Columns: Identity Card & Navigation Cards) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Customer Identity Card */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs relative">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-[#F5EFE8] border border-[#DED4CB] flex items-center justify-center overflow-hidden shrink-0">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-serif text-[#8B634B] font-bold">{getInitials(user?.name)}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditData({ name: user?.name || "", phone: user?.phone || "", image: null })
                    setShowEditModal(true)
                  }}
                  className="absolute bottom-0 right-0 bg-[#8B634B] text-white p-2 rounded-full shadow-xs hover:bg-[#30251F] transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <h2 className="text-2xl font-serif font-normal text-[#30251F] uppercase">
                  {user?.name || "AUTHENTICATED CLIENT"}
                </h2>
                <div className="space-y-1 text-xs text-[#76675D]">
                  <p className="flex items-center justify-center sm:justify-start space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#8B634B]" />
                    <span>{user?.email}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#8B634B]" />
                    <span>{user?.phone || "No phone connected"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "MY ORDERS", icon: Package, path: "/myorder", desc: "Track & review orders" },
                { label: "ALDEN WALLET", icon: CreditCard, path: "/wallet", desc: "Digital wallet balance" },
                { label: "TRANSACTIONS", icon: Repeat, path: "/transactions", desc: "Ledger transaction history" },
              ].map((card) => {
                const IconComp = card.icon
                return (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => navigate(card.path)}
                    className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 text-center space-y-2 hover:border-[#8B634B] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <IconComp className="w-6 h-6 text-[#8B634B] mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                      {card.label}
                    </h3>
                    <p className="text-[11px] text-[#76675D]">{card.desc}</p>
                  </button>
                )
              })}
            </div>

          </div>

          {/* Right Column (4 Columns: Address Management) */}
          <div className="lg:col-span-4">
            <AddressSection />
          </div>

        </div>

      </main>

      {/* Edit Profile Details Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="UPDATE PROFILE DETAILS"
      >
        <div className="space-y-4 font-sans">
          <Input
            label="Full Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <Input
            label="Phone Number"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#30251F]">Profile Photo</label>
            <input
              type="file"
              onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
              className="w-full text-xs text-[#76675D] file:mr-4 file:py-2 file:px-4 file:rounded-[4px] file:border-0 file:text-xs file:font-semibold file:bg-[#8B634B] file:text-white hover:file:bg-[#30251F]"
            />
          </div>
          <div className="pt-3 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>CANCEL</Button>
            <Button variant="primary" onClick={handleUpdateProfile}>SAVE CHANGES</Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="CHANGE PASSWORD"
      >
        <div className="space-y-3 font-sans">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
          {passwordError && (
            <p className="text-xs text-[#8C2727] font-semibold">{passwordError}</p>
          )}
          <div className="pt-3 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>CANCEL</Button>
            <Button variant="primary" onClick={handleChangePassword}>UPDATE PASSWORD</Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

export default Profile