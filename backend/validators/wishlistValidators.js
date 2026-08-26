/**
 * Validates wishlist sync items array payload
 */
export const validateSyncWishlistInput = (items) => {
  if (!Array.isArray(items)) {
    return {
      isValid: false,
      message: "Wishlist items must be an array"
    }
  }
  return { isValid: true }
}
