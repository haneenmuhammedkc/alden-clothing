import { isPositiveNumber, isNonEmptyString } from "./commonValidators.js"

/**
 * Validates request payload for crediting wallet funds
 */
export const validateCreditWalletInput = ({ amount, paymentId }) => {
  if (!isPositiveNumber(amount)) {
    return {
      isValid: false,
      message: "Invalid credit amount"
    }
  }
  return { isValid: true }
}

/**
 * Validates request payload for debiting wallet funds
 */
export const validateDebitWalletInput = ({ amount, orderId }) => {
  if (!isPositiveNumber(amount)) {
    return {
      isValid: false,
      message: "Invalid debit amount"
    }
  }
  return { isValid: true }
}
