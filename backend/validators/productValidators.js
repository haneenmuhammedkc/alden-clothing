import mongoose from "mongoose"
import { isNonEmptyString, isValidObjectId } from "./commonValidators.js"

/**
 * Validates admin product creation input payload
 */
export const validateCreateProductInput = (data) => {
  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      message: "Invalid product data payload"
    }
  }

  if (!data.category || !isValidObjectId(data.category)) {
    return {
      isValid: false,
      message: "Invalid category"
    }
  }

  return { isValid: true }
}

/**
 * Validates product ID parameter
 */
export const validateProductIdInput = (id) => {
  if (!isValidObjectId(id)) {
    return {
      isValid: false,
      message: "Invalid product ID format"
    }
  }
  return { isValid: true }
}
