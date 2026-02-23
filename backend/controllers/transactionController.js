import Transaction from "../models/Transaction.js"

export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })

    res.json({ transactions })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions" })
  }
}