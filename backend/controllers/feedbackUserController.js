import {
  createFeedback,
  fetchProductReviews,
  deleteUserFeedback
} from "../services/feedbackService.js"

export const addFeedback = async (req, res) => {
  try {
    const { productId, rating, message, type = "review" } = req.body
    const feedback = await createFeedback({
      userId: req.user.id,
      productId,
      rating,
      message,
      type
    })

    return res.status(201).json({ success: true, feedback })
  } catch (err) {
    console.error("Add Feedback Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: err.message || "Failed to submit feedback" })
  }
}

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await fetchProductReviews(req.params.productId)
    return res.json({ success: true, data: reviews })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: err.message || "Failed to fetch reviews" })
  }
}

export const deleteFeedback = async (req, res) => {
  try {
    const result = await deleteUserFeedback(req.user.id, req.params.id)
    return res.json({ success: true, message: result.message })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: err.message || "Failed to delete feedback" })
  }
}