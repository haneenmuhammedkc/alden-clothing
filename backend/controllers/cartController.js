import {
  fetchUserCart,
  syncUserCart,
  clearUserCart
} from "../services/cartService.js"

export const getCart = async (req, res) => {
  try {
    const cart = await fetchUserCart(req.user.id)
    return res.json(cart)
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Failed to fetch cart" })
  }
}

export const addCart = async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body.items) ? req.body.items : []
    const cart = await syncUserCart(req.user.id, rawItems)
    return res.json(cart)
  } catch (err) {
    console.error("Update Cart Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Failed to update cart" })
  }
}

export const clearCart = async (req, res) => {
  try {
    const cart = await clearUserCart(req.user.id)
    return res.json({ success: true, message: "Cart cleared", cart })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Failed to clear cart" })
  }
}
