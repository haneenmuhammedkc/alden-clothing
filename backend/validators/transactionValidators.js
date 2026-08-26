import { isNonEmptyString } from "./commonValidators.js"

/**
 * Validates user ID input for transaction queries
 */
export const validateTransactionQueryUser = (userId) => {
  if (!isNonEmptyString(userId)) {
    return {
      isValid: false,
      message: "User ID is required"
    }
  }
  return { isValid: true }
}
