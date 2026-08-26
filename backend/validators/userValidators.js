import { isNonEmptyString, isValidObjectId } from "./commonValidators.js"

/**
 * Validates profile update payload
 */
export const validateUpdateProfileInput = (data) => {
  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      message: "Invalid profile update payload"
    }
  }
  return { isValid: true }
}

/**
 * Validates change password request payload
 */
export const validateChangePasswordInput = ({ currentPassword, newPassword }) => {
  if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword)) {
    return {
      isValid: false,
      message: "Current password and new password are required"
    }
  }
  return { isValid: true }
}

/**
 * Validates address creation request payload
 */
export const validateAddAddressInput = (addressData) => {
  if (
    !addressData ||
    !isNonEmptyString(addressData.firstName) ||
    !isNonEmptyString(addressData.phone) ||
    !isNonEmptyString(addressData.email) ||
    !addressData.address ||
    !isNonEmptyString(addressData.address.line) ||
    !isNonEmptyString(addressData.address.city) ||
    !isNonEmptyString(addressData.address.state) ||
    !isNonEmptyString(addressData.address.pincode)
  ) {
    return {
      isValid: false,
      message: "Missing required address fields"
    }
  }
  return { isValid: true }
}

/**
 * Validates address update request payload
 */
export const validateUpdateAddressInput = (addressData) => {
  if (!addressData || typeof addressData !== "object") {
    return {
      isValid: false,
      message: "Invalid address update payload"
    }
  }
  return { isValid: true }
}

/**
 * Validates address ID parameter
 */
export const validateAddressIdInput = (addressId) => {
  if (!isNonEmptyString(addressId)) {
    return {
      isValid: false,
      message: "Address ID is required"
    }
  }
  return { isValid: true }
}
