import {
  fetchUserTransactions,
  fetchAllAdminTransactions
} from "../services/transactionService.js"

export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await fetchUserTransactions(req.user.id)
    return res.json({ success: true, transactions })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message || "Failed to fetch transactions" })
  }
}

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await fetchAllAdminTransactions()
    return res.json({ success: true, transactions })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message || "Failed to fetch all transactions" })
  }
}