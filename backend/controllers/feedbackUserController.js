import Feedback from "../models/Feedback.js"
import Order from "../models/Order.js"

export const addFeedback = async (req, res) => {
  try {
    const { productId, rating, message, type } = req.body

    if (!productId || !message || !type) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (type === "review" && !rating) {
      return res.status(400).json({ message: "Rating is required for review" })
    }

    // 🔒 Prevent duplicate reviews
    if (type === "review") {
      const existing = await Feedback.findOne({
        user: req.user.id,
        product: productId,
        type: "review"
      })

      if (existing) {
        return res.status(400).json({ message: "You already reviewed this product" })
      }
    }

    // ✅ Check verified buyer
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      "items.product": productId
    })

    const isVerified = !!hasPurchased

    const feedback = await Feedback.create({
      user: req.user.id,
      product: productId,
      rating,
      message,
      type,
      isVerified
    })

    res.status(201).json(feedback)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to submit feedback" })
  }
}

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Feedback.find({
      product: req.params.productId,
      type: "review"
    }).populate("user", "firstName")

    res.json({ data: reviews })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" })
  }
}