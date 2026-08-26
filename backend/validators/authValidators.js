import { isNonEmptyString, isValidEmail } from "./commonValidators.js"

/**
 * Validates registration request payload
 */
export const validateRegisterInput = ({ name, email, password, phone }) => {
  if (
    !isNonEmptyString(name) ||
    !isValidEmail(email) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(phone)
  ) {
    return {
      isValid: false,
      message: "Please fill all required fields"
    }
  }
  return { isValid: true }
}

/**
 * Validates email OTP verification request payload
 */
export const validateVerifyOtpInput = ({ email, otp }) => {
  if (!isValidEmail(email) || !isNonEmptyString(otp)) {
    return {
      isValid: false,
      message: "Email and OTP are required"
    }
  }
  return { isValid: true }
}

/**
 * Validates customer login request payload
 */
export const validateLoginInput = ({ email, password }) => {
  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    return {
      isValid: false,
      message: "Please enter email and password"
    }
  }
  return { isValid: true }
}

/**
 * Validates Firebase Google login request payload
 */
export const validateGoogleLoginInput = ({ token }) => {
  if (!isNonEmptyString(token)) {
    return {
      isValid: false,
      message: "Google authentication token is required"
    }
  }
  return { isValid: true }
}

/**
 * Validates forgot password request payload
 */
export const validateForgotPasswordInput = ({ email }) => {
  if (!isValidEmail(email)) {
    return {
      isValid: false,
      message: "Valid email is required"
    }
  }
  return { isValid: true }
}

/**
 * Validates reset password request payload
 */
export const validateResetPasswordInput = ({ email, otp, newPassword }) => {
  if (!isValidEmail(email) || !isNonEmptyString(otp) || !isNonEmptyString(newPassword)) {
    return {
      isValid: false,
      message: "Email, OTP, and new password are required"
    }
  }
  return { isValid: true }
}
