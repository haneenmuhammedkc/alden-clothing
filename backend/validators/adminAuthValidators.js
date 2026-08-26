import { isNonEmptyString, isValidEmail } from "./commonValidators.js"

/**
 * Validates admin login input payload
 */
export const validateAdminLoginInput = ({ email, password }) => {
  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    return {
      isValid: false,
      message: "Email and password are required"
    }
  }
  return { isValid: true }
}
