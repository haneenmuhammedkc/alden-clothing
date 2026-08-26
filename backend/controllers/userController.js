import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  addUserAddress,
  fetchUserAddresses,
  setUserDefaultAddress,
  updateUserAddress,
  deleteUserAddress
} from "../services/userService.js"
import {
  forgotCustomerPassword,
  resetCustomerPassword
} from "../services/authService.js"

export const getMyProfile = async (req, res) => {
  try {
    const user = await fetchUserProfile(req.user.id)
    return res.status(200).json({ success: true, user })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body)
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.error("UPDATE ERROR:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const result = await changeUserPassword(req.user.id, { currentPassword, newPassword })

    return res.json({ success: true, message: result.message })
  } catch (error) {
    const statusCode = error.statusCode || 400
    return res.status(statusCode).json({ message: error.message })
  }
}

export const addAddress = async (req, res) => {
  try {
    const addresses = await addUserAddress(req.user.id, req.body)
    return res.status(201).json({
      success: true,
      addresses
    })
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message })
  }
}

export const getAddresses = async (req, res) => {
  try {
    const addresses = await fetchUserAddresses(req.user.id)
    return res.status(200).json(addresses)
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message })
  }
}

export const setDefaultAddress = async (req, res) => {
  try {
    const addresses = await setUserDefaultAddress(req.user.id, req.params.addressId)
    return res.status(200).json({
      success: true,
      addresses
    })
  } catch (error) {
    console.error("SET DEFAULT ADDRESS ERROR:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message })
  }
}

export const deleteAddress = async (req, res) => {
  try {
    const addresses = await deleteUserAddress(req.user.id, req.params.addressId)
    return res.status(200).json({
      success: true,
      addresses
    })
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message })
  }
}

export const updateAddress = async (req, res) => {
  try {
    const addresses = await updateUserAddress(req.user.id, req.params.addressId, req.body)
    return res.status(200).json({
      success: true,
      addresses
    })
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const result = await forgotCustomerPassword({ email })

    return res.json({ message: result.message })
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    const result = await resetCustomerPassword({ email, otp, newPassword })

    return res.json({ message: result.message })
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message })
  }
}