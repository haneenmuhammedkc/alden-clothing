import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { ServiceError } from "./serviceError.js"
import {
  validateUpdateProfileInput,
  validateChangePasswordInput,
  validateAddAddressInput,
  validateUpdateAddressInput,
  validateAddressIdInput
} from "../validators/userValidators.js"

export const fetchUserProfile = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const user = await User.findById(userId).select("-password")
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  return user
}

export const updateUserProfile = async (userId, data) => {
  const validation = validateUpdateProfileInput(data)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const { name, phone, profileImage } = data
  const updateData = {}

  if (name !== undefined) updateData.name = name
  if (phone !== undefined) updateData.phone = phone
  if (profileImage !== undefined) updateData.profileImage = profileImage

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password")
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  return user
}

export const changeUserPassword = async (userId, { currentPassword, newPassword }) => {
  const validation = validateChangePasswordInput({ currentPassword, newPassword })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const user = await User.findById(userId).select("+password")
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    throw new ServiceError("Current password is incorrect", 400)
  }

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()

  return { message: "Password updated" }
}

export const addUserAddress = async (userId, addressData) => {
  const validation = validateAddAddressInput(addressData)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  if (!user.addresses) {
    user.addresses = []
  }

  // ⭐ If new address is default → remove previous defaults
  if (addressData.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false
    })
  }

  // ⭐ If first address → auto default
  if (user.addresses.length === 0) {
    addressData.isDefault = true
  }

  user.addresses.push(addressData)
  await user.save()

  return user.addresses
}

export const fetchUserAddresses = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  return user.addresses || []
}

export const setUserDefaultAddress = async (userId, addressId) => {
  const validation = validateAddressIdInput(addressId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  // Reset all to false
  user.addresses.forEach((addr) => {
    addr.isDefault = false
  })

  // Set selected one to true
  const address = user.addresses.id(addressId)
  if (!address) {
    throw new ServiceError("Address not found", 404)
  }

  address.isDefault = true
  await user.save()

  return user.addresses
}

export const updateUserAddress = async (userId, addressId, updateData) => {
  const idValidation = validateAddressIdInput(addressId)
  if (!idValidation.isValid) {
    throw new ServiceError(idValidation.message, 400)
  }

  const dataValidation = validateUpdateAddressInput(updateData)
  if (!dataValidation.isValid) {
    throw new ServiceError(dataValidation.message, 400)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  const address = user.addresses.id(addressId)
  if (!address) {
    throw new ServiceError("Address not found", 404)
  }

  // ⭐ If updating to default → unset others first
  if (updateData.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false
    })
  }

  Object.assign(address, updateData)
  await user.save()

  return user.addresses
}

export const deleteUserAddress = async (userId, addressId) => {
  const validation = validateAddressIdInput(addressId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  const address = user.addresses.id(addressId)
  if (!address) {
    throw new ServiceError("Address not found", 404)
  }

  const wasDefault = address.isDefault
  address.deleteOne()

  // 🔁 If default was deleted, set first address as default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true
  }

  await user.save()

  return user.addresses
}
