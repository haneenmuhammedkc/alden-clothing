import Razorpay from "razorpay"
import Transaction from "../models/Transaction.js"
import Order from "../models/Order.js"
import crypto from "crypto"

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing in .env")
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay()   // 👈 create here

    const { amount } = req.body

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    })

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
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

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" })
    }

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })

    if (order.paymentStatus === "paid") {
      return res.json({ message: "Already verified" })
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
      user: req.user.id,
      type: "ORDER_PAYMENT",
      method: "RAZORPAY",
      amount: Number(order.total || order.totalAmount),
      orderId: order._id,
      description: `Paid for Order #${order._id}`,
      status: "SUCCESS"
    })

    res.json({ message: "Payment verified successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Verification failed" })
  }
}