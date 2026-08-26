import { isNonEmptyString, isValidEmail } from "./commonValidators.js"

/**
 * Validates request payload for order creation
 */
export const validateCreateOrderInput = ({ customer, items, paymentMethod }) => {
  if (
    !customer ||
    !isNonEmptyString(customer.firstName) ||
    !isNonEmptyString(customer.phone) ||
    !isValidEmail(customer.email) ||
    !customer.address ||
    !isNonEmptyString(customer.address.line) ||
    !isNonEmptyString(customer.address.city) ||
    !isNonEmptyString(customer.address.state) ||
    !isNonEmptyString(customer.address.pincode) ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !isNonEmptyString(paymentMethod)
  ) {
    return {
      isValid: false,
      message: "Missing or invalid order data"
    }
  }

  // Ensure every item has a product reference
  for (const item of items) {
    if (!item || !(item.productId || item._id)) {
      return {
        isValid: false,
        message: "Every item must specify a valid product reference"
      }
    }
  }

  return { isValid: true }
}

/**
 * Validates order ID parameter
 */
export const validateOrderIdInput = (id) => {
  if (!isNonEmptyString(id)) {
    return {
      isValid: false,
      message: "Order ID is required"
    }
  }
  return { isValid: true }
}

/**
 * Validates order status transition string
 */
export const validateOrderStatusInput = (status) => {
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
  if (!isNonEmptyString(status) || !validStatuses.includes(status)) {
    return {
      isValid: false,
      message: "Invalid status value"
    }
  }
  return { isValid: true }
}
