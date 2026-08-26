import Cart from "../models/Cart.js"
import { ServiceError } from "./serviceError.js"
import { validateSyncCartInput } from "../validators/cartValidators.js"

export const fetchUserCart = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const cart = await Cart.findOne({ user: userId })
  return cart || { items: [] }
}

export const syncUserCart = async (userId, rawItems) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const validation = validateSyncCartInput(rawItems)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  // 🔒 Sanitize & validate items array
  const sanitizedItems = rawItems
    .filter((item) => item && (item._id || item.productId) && item.name)
    .map((item) => ({
      _id: String(item._id || item.productId),
      productId: item._id || item.productId,
      name: String(item.name).trim(),
      price: Number(item.price) || 0,
      image: item.image || "",
      color: String(item.color || "").trim(),
      size: String(item.size || "").trim(),
      qty: Math.max(1, Math.floor(Number(item.qty) || 1)) // Enforce positive integer quantity >= 1
    }))

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: sanitizedItems },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  return cart
}

export const clearUserCart = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  )

  return cart
}
