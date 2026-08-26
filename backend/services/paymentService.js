import Razorpay from "razorpay"
import crypto from "crypto"
import Order from "../models/Order.js"
import Transaction from "../models/Transaction.js"
import { ServiceError } from "./serviceError.js"
import {
  validateCreateRazorpayOrderInput,
  validateVerifyRazorpayPaymentInput
} from "../validators/paymentValidators.js"

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ServiceError("Razorpay keys missing in environment variables", 500)
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

export const createRazorpayOrderAmount = async (amount) => {
  const validation = validateCreateRazorpayOrderInput(amount)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const razorpay = getRazorpay()

  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  })

  return order
}

export const verifyRazorpayPaymentSignature = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId,
  userId
}) => {
  const validation = validateVerifyRazorpayPaymentInput({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature !== razorpay_signature) {
    throw new ServiceError("Invalid signature", 400)
  }

  const order = await Order.findById(orderId)
  if (!order) {
    throw new ServiceError("Order not found", 404)
  }

  if (order.paymentStatus === "paid") {
    return { alreadyVerified: true, message: "Already verified" }
  }

  order.paymentStatus = "paid"
  order.paymentMethod = "razorpay"
  order.razorpay = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  }
  await order.save()

  await Transaction.create({
    user: userId,
    type: "ORDER_PAYMENT",
    method: "RAZORPAY",
    reference: razorpay_payment_id,
    amount: Number(order.total || order.totalAmount || 0),
    orderId: order._id,
    description: `Paid for Order #${order.orderId || order._id} (Razorpay)`,
    status: "SUCCESS"
  })

  return { alreadyVerified: false, message: "Payment verified successfully" }
}
