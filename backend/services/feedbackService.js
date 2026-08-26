import Feedback from "../models/Feedback.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { ServiceError } from "./serviceError.js"
import {
  validateCreateFeedbackInput,
  validateFeedbackIdInput
} from "../validators/feedbackValidators.js"

export const createFeedback = async ({ userId, productId, rating, message, type = "review" }) => {
  const validation = validateCreateFeedbackInput({ productId, message, rating, type })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  // 🔒 1. Validate Product Existence
  const dbProduct = await Product.findById(productId)
  if (!dbProduct || dbProduct.isDeleted) {
    throw new ServiceError("Product not found or unavailable", 404)
  }

  // 🔒 2. Prevent duplicate reviews (Checked at app & DB partial unique index layer)
  if (type === "review") {
    const existing = await Feedback.findOne({
      user: userId,
      product: productId,
      type: "review"
    })

    if (existing) {
      throw new ServiceError("You have already reviewed this product", 400)
    }
  }

  // 🔒 3. Verified Buyer Check (Query items.productId & paid status)
  const hasPurchased = await Order.findOne({
    user: userId,
    paymentStatus: "paid",
    "items.productId": productId
  })

  const isVerified = !!hasPurchased
  const numRating = Number(rating)

  try {
    const feedback = await Feedback.create({
      user: userId,
      product: productId,
      rating: type === "review" ? numRating : undefined,
      message: String(message).trim(),
      type,
      isVerified
    })

    return feedback
  } catch (err) {
    if (err.code === 11000) {
      throw new ServiceError("You have already reviewed this product", 400)
    }
    throw new ServiceError("Failed to submit feedback", 500)
  }
}

export const fetchProductReviews = async (productId) => {
  const validation = validateFeedbackIdInput(productId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  return await Feedback.find({
    product: productId,
    type: "review"
  })
    .populate("user", "name email profileImage")
    .sort({ createdAt: -1 })
}

export const deleteUserFeedback = async (userId, feedbackId) => {
  const validation = validateFeedbackIdInput(feedbackId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const feedback = await Feedback.findOneAndDelete({
    _id: feedbackId,
    user: userId // 🔒 IDOR protection: User can only delete own review
  })

  if (!feedback) {
    throw new ServiceError("Feedback not found or unauthorized", 404)
  }

  return { message: "Feedback deleted successfully" }
}

export const fetchAllAdminFeedbacks = async () => {
  return await Feedback.find()
    .populate("user", "firstName email")
    .populate("product", "name")
    .sort({ createdAt: -1 })
}

export const resolveAdminFeedback = async (feedbackId) => {
  const validation = validateFeedbackIdInput(feedbackId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const feedback = await Feedback.findById(feedbackId)
  if (!feedback) {
    throw new ServiceError("Feedback not found", 404)
  }

  feedback.status = "resolved"
  await feedback.save()

  return feedback
}

export const deleteAdminFeedback = async (feedbackId) => {
  const validation = validateFeedbackIdInput(feedbackId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const feedback = await Feedback.findByIdAndDelete(feedbackId)
  if (!feedback) {
    throw new ServiceError("Feedback not found", 404)
  }

  return { message: "Feedback deleted by administrator" }
}
