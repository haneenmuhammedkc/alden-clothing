/**
 * Centralized utility to generate a secure 6-digit numeric OTP string
 */
export const generateSixDigitOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
