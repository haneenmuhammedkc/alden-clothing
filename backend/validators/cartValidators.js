import { isNonEmptyString } from "./commonValidators.js"

/**
 * Validates cart update/sync items array payload
 */
export const validateSyncCartInput = (items) => {
  if (!Array.isArray(items)) {
    return {
      isValid: false,
      message: "Cart items must be an array"
    }
  }
  return { isValid: true }
}
