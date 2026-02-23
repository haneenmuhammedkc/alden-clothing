import Feedback from "../models/Feedback.js"

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "firstName email")
      .populate("product", "name")
      .sort({ createdAt: -1 })

    res.json({ data: feedbacks })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedbacks" })
  }
}

export const resolveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    feedback.status = "resolved"
    await feedback.save()

    res.json(feedback)
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve" })
  }
}