import { isNonEmptyString, isValidObjectId } from "./commonValidators.js"

/**
 * Validates category creation request payload
 */
export const validateCreateCategoryInput = ({ name }) => {
  if (!isNonEmptyString(name)) {
    return {
      isValid: false,
      message: "Category name is required"
    }
  }
  return { isValid: true }
}

/**
 * Validates category ID parameter
 */
export const validateCategoryIdInput = (id) => {
  if (!isValidObjectId(id)) {
    return {
      isValid: false,
      message: "Invalid category ID format"
    }
  }
  return { isValid: true }
}
