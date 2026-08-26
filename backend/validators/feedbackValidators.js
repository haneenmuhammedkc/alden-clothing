import { isNonEmptyString, isValidObjectId } from "./commonValidators.js"

/**
 * Validates review/feedback payload
 */
export const validateCreateFeedbackInput = ({ productId, message, rating, type = "review" }) => {
  if (!isValidObjectId(productId) || !isNonEmptyString(message)) {
    return {
      isValid: false,
      message: "Missing required fields"
    }
  }

  if (type === "review") {
    const numRating = Number(rating)
    if (!numRating || numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
      return {
        isValid: false,
        message: "Rating must be an integer between 1 and 5"
      }
    }
  }

  return { isValid: true }
}

/**
 * Validates feedback ID parameter
 */
export const validateFeedbackIdInput = (id) => {
  if (!isValidObjectId(id)) {
    return {
      isValid: false,
      message: "Invalid feedback ID format"
    }
  }
  return { isValid: true }
}
