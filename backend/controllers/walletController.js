import {
  fetchUserWallet,
  creditUserWallet,
  debitUserWallet
} from "../services/walletService.js"

export const getWallet = async (req, res) => {
  try {
    const data = await fetchUserWallet(req.user.id)
    return res.json({
      success: true,
      balance: data.balance,
      transactions: data.transactions,
      user: data.user
    })
  } catch (err) {
    console.error("Get Wallet Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ message: err.message })
  }
}

export const creditWallet = async (req, res) => {
  try {
    const { amount, paymentId } = req.body
    const data = await creditUserWallet({
      userId: req.user.id,
      amount,
      paymentId
    })

    return res.json({
      success: true,
      balance: data.balance
    })
  } catch (err) {
    console.error("Credit Wallet Error:", err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

export const debitWallet = async (req, res) => {
  try {
    const { amount, orderId } = req.body
    const data = await debitUserWallet({
      userId: req.user.id,
      amount,
      orderId
    })

    return res.json({
      success: true,
      balance: data.balance
    })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}