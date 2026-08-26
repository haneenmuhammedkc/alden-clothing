import Wishlist from "../models/Wishlist.js"
import { ServiceError } from "./serviceError.js"
import { validateSyncWishlistInput } from "../validators/wishlistValidators.js"

export const fetchUserWishlist = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const wishlist = await Wishlist.findOne({ user: userId })
  return wishlist || { items: [] }
}

export const syncUserWishlist = async (userId, rawItems) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const validation = validateSyncWishlistInput(rawItems)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  // 🔒 Deduplicate & sanitize items by product ID
  const seenIds = new Set()
  const sanitizedItems = []

  for (const item of rawItems) {
    if (!item) continue
    const prodId = String(item._id || item.productId || "").trim()
    if (!prodId || seenIds.has(prodId)) continue

    seenIds.add(prodId)
    sanitizedItems.push({
      _id: prodId,
      productId: item._id || item.productId,
      name: String(item.name || "").trim(),
      price: Number(item.price) || 0,
      image: item.image || "",
      color: String(item.color || "").trim(),
      addedAt: item.addedAt || new Date()
    })
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { items: sanitizedItems },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  return wishlist
}

export const clearUserWishlist = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  )

  return wishlist
}
