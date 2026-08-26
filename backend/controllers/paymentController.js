import {
  createRazorpayOrderAmount,
  verifyRazorpayPaymentSignature
} from "../services/paymentService.js"

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body
    const order = await createRazorpayOrderAmount(amount)

    return res.status(200).json({ success: true, order })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body

    const result = await verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId: req.user.id
    })

    return res.json({ message: result.message })
  } catch (err) {
    console.error("Razorpay Verification Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message || "Verification failed" })
  }
}