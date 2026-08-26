import {
  fetchUserWishlist,
  syncUserWishlist,
  clearUserWishlist
} from "../services/wishlistService.js"

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await fetchUserWishlist(req.user.id)
    return res.json(wishlist)
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Failed to fetch wishlist" })
  }
}

export const addWishlist = async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body.items) ? req.body.items : []
    const wishlist = await syncUserWishlist(req.user.id, rawItems)
    return res.json(wishlist)
  } catch (err) {
    console.error("Update Wishlist Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Failed to update wishlist" })
  }
}

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await clearUserWishlist(req.user.id)
    return res.json({ success: true, message: "Wishlist cleared", wishlist })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Failed to clear wishlist" })
  }
}
