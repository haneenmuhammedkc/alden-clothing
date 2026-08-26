import { isPositiveNumber, isNonEmptyString } from "./commonValidators.js"

/**
 * Validates Razorpay order creation input amount
 */
export const validateCreateRazorpayOrderInput = (amount) => {
  if (!isPositiveNumber(amount)) {
    return {
      isValid: false,
      message: "Invalid order amount"
    }
  }
  return { isValid: true }
}

/**
 * Validates Razorpay payment signature verification payload
 */
export const validateVerifyRazorpayPaymentInput = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId
}) => {
  if (
    !isNonEmptyString(razorpay_order_id) ||
    !isNonEmptyString(razorpay_payment_id) ||
    !isNonEmptyString(razorpay_signature) ||
    !isNonEmptyString(orderId)
  ) {
    return {
      isValid: false,
      message: "Missing required payment verification fields"
    }
  }
  return { isValid: true }
}
