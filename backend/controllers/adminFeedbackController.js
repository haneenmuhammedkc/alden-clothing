import {
  fetchAllAdminFeedbacks,
  resolveAdminFeedback,
  deleteAdminFeedback
} from "../services/feedbackService.js"

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await fetchAllAdminFeedbacks()
    return res.json({ data: feedbacks })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: "Failed to fetch feedbacks" })
  }
}

export const resolveFeedback = async (req, res) => {
  try {
    const feedback = await resolveAdminFeedback(req.params.id)
    return res.json({ success: true, feedback })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: err.message || "Failed to resolve" })
  }
}

export const deleteFeedbackAdmin = async (req, res) => {
  try {
    const result = await deleteAdminFeedback(req.params.id)
    return res.json({ success: true, message: result.message })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: err.message || "Failed to delete feedback" })
  }
}