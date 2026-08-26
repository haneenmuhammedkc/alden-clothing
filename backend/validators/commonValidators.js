import mongoose from "mongoose"

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return Boolean(id && mongoose.Types.ObjectId.isValid(id))
}

/**
 * Validates if a string is a non-empty string
 */
export const isNonEmptyString = (str) => {
  return typeof str === "string" && str.trim().length > 0
}

/**
 * Validates if a value is a positive number (> 0)
 */
export const isPositiveNumber = (val) => {
  const num = Number(val)
  return typeof num === "number" && !isNaN(num) && num > 0
}

/**
 * Validates if a value is a non-negative number (>= 0)
 */
export const isNonNegativeNumber = (val) => {
  const num = Number(val)
  return typeof num === "number" && !isNaN(num) && num >= 0
}

/**
 * Validates if a value is a positive integer (>= 1)
 */
export const isPositiveInteger = (val) => {
  const num = Number(val)
  return Number.isInteger(num) && num >= 1
}

/**
 * Validates email format using basic standard RFC-like regex
 */
export const isValidEmail = (email) => {
  if (!isNonEmptyString(email)) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}
