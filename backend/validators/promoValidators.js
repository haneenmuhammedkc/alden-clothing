import { isNonEmptyString, isNonNegativeNumber } from "./commonValidators.js"

/**
 * Validates admin promo creation input payload
 */
export const validateCreatePromoInput = ({ code, discountType, discountValue, expiryDate }) => {
  if (
    !isNonEmptyString(code) ||
    !isNonEmptyString(discountType) ||
    discountValue === undefined ||
    !expiryDate
  ) {
    return {
      isValid: false,
      message: "Missing required fields"
    }
  }

  const numValue = Number(discountValue)
  if (isNaN(numValue) || numValue < 0) {
    return {
      isValid: false,
      message: "Discount value cannot be negative"
    }
  }

  if (discountType === "percent" && numValue > 100) {
    return {
      isValid: false,
      message: "Percentage discount cannot exceed 100%"
    }
  }

  return { isValid: true }
}

/**
 * Validates customer apply promo request payload
 */
export const validateApplyPromoInput = ({ code }) => {
  if (!isNonEmptyString(code)) {
    return {
      isValid: false,
      message: "Promo code is required"
    }
  }
  return { isValid: true }
}
