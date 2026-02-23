import Wallet from "../models/Wallet.js"
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"

export const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id })

    // Auto-create wallet, If missing
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user.id,
        balance: 0,
        transactions: []
      })
    }

    // Fetch user details
    const user = await User.findById(req.user.id).select("name email")

    res.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions.reverse(),
      user: {
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    console.error("Get Wallet Error:", err)
    res.status(500).json({ message: err.message })
  }
}


export const creditWallet = async (req, res) => {
  try {
    const { amount, paymentId } = req.body

    let wallet = await Wallet.findOne({ user: req.user.id })

    // 🔥 AUTO-CREATE WALLET IF MISSING
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user.id,
        balance: 0,
        transactions: []
      })
    }

    // 1️⃣ Credit wallet
    wallet.balance += Number(amount)

    wallet.transactions.push({
      type: "CREDIT",
      amount: Number(amount),
      label: "Fund Added",
      reference: paymentId
    })

    await wallet.save()

    // 2️⃣ 🔹 Log unified transaction
    await Transaction.create({
      user: req.user.id,
      type: "WALLET_CREDIT",
      amount: Number(amount),
      balanceAfter: wallet.balance,
      description: "Wallet credited",
      status: "SUCCESS"
    })

    res.json({
      success: true,
      balance: wallet.balance
    })
  } catch (err) {
    console.error("Credit Wallet Error:", err)
    res.status(500).json({ message: err.message })
  }
}

export const debitWallet = async (req, res) => {
  try {
    const { amount, orderId } = req.body

    const wallet = await Wallet.findOne({ user: req.user.id })

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" })
    }

    wallet.balance -= Number(amount)

    wallet.transactions.push({
      type: "DEBIT",
      amount,
      label: "Purchase",
      reference: orderId
    })

    await wallet.save()

    res.json({
      success: true,
      balance: wallet.balance
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}