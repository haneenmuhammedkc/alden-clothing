import bcrypt from "bcryptjs"
import User from "../models/User.js"
import sendEmail from "../utils/sendEmail.js"

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body
    const updateData = {}

    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (profileImage !== undefined) updateData.profileImage = profileImage

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password")

    console.log("UPDATED USER:", user) // 👈 DEBUG LINE

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.log("UPDATE ERROR:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password)

  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" })
  }

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()

  res.json({ success: true, message: "Password updated" })
}

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!user.addresses) {
      user.addresses = []
    }

    // ⭐ If new address is default → remove previous defaults
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false
      })
    }

    // ⭐ If first address → auto default
    if (user.addresses.length === 0) {
      req.body.isDefault = true
    }

    user.addresses.push(req.body)
    await user.save()

    res.status(201).json({
      success: true,
      addresses: user.addresses
    })
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id
    const { addressId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Reset all to false
    user.addresses.forEach(addr => {
      addr.isDefault = false
    })

    // Set selected one to true
    const address = user.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    address.isDefault = true

    await user.save()

    res.status(200).json({
      success: true,
      addresses: user.addresses
    })
  } catch (error) {
    console.error("SET DEFAULT ADDRESS ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id
    const { addressId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    const wasDefault = address.isDefault

    // Remove address
    address.deleteOne()

    // 🔁 If default was deleted, set first address as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true
    }

    await user.save()

    res.status(200).json({
      success: true,
      addresses: user.addresses
    })
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id
    const { addressId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    // ⭐ If updating to default → unset others first
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false
      })
    }

    Object.assign(address, req.body)

    await user.save()

    res.status(200).json({
      success: true,
      addresses: user.addresses
    })
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.resetOtp = otp
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000
    await user.save()

    await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`)

    res.json({ message: "OTP sent successfully" })
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err)
    res.status(500).json({ message: err.message })
}
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() }
    })

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" })

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetOtp = null
    user.resetOtpExpire = null
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (err) {
  console.error("RESET PASSWORD ERROR:", err)
  res.status(500).json({ message: err.message })
}
}