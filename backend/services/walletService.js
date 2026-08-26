import Wallet from "../models/Wallet.js"
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"
import { ServiceError } from "./serviceError.js"
import {
  validateCreditWalletInput,
  validateDebitWalletInput
} from "../validators/walletValidators.js"

/**
 * Retrieves user wallet balance, transaction log history, and user profile details.
 * Auto-creates a new wallet document if none exists.
 */
export const fetchUserWallet = async (userId) => {
  if (!userId) {
    throw new ServiceError("User ID is required", 400)
  }

  let wallet = await Wallet.findOne({ user: userId })

  // Auto-create wallet if missing
  if (!wallet) {
    wallet = await Wallet.create({
      user: userId,
      balance: 0,
      transactions: []
    })
  }

  const user = await User.findById(userId).select("name email")
  if (!user) {
    throw new ServiceError("User not found", 404)
  }

  return {
    balance: wallet.balance,
    transactions: [...wallet.transactions].reverse(),
    user: {
      name: user.name,
      email: user.email
    }
  }
}

/**
 * 🔒 Idempotent & Atomic Wallet Top-Up (Credit):
 * 1. Validates positive credit amount
 * 2. Checks paymentId reference idempotency to prevent double-crediting
 * 3. Executes atomic $inc credit update
 * 4. Logs unified Transaction ledger record
 */
export const creditUserWallet = async ({ userId, amount, paymentId }) => {
  const validation = validateCreditWalletInput({ amount, paymentId })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const numAmount = Number(amount)

  // 🔒 Idempotency check: Prevent duplicate credits for same paymentId
  if (paymentId) {
    const existingWalletTxn = await Wallet.findOne({
      user: userId,
      "transactions.reference": paymentId
    })
    if (existingWalletTxn) {
      throw new ServiceError("Credit transaction already processed", 400)
    }
  }

  // 1️⃣ Atomic credit with $inc
  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    {
      $inc: { balance: numAmount },
      $push: {
        transactions: {
          type: "CREDIT",
          amount: numAmount,
          label: "Fund Added",
          reference: paymentId || undefined,
          createdAt: new Date()
        }
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  // 2️⃣ Log unified transaction record
  await Transaction.create({
    user: userId,
    type: "WALLET_CREDIT",
    amount: numAmount,
    balanceAfter: wallet.balance,
    description: `Wallet credited ₹${numAmount}`,
    status: "SUCCESS"
  })

  return { balance: wallet.balance }
}

/**
 * 🔒 Concurrency-Safe Atomic Wallet Debit:
 * Executes atomic write with { balance: { $gte: numAmount } } to prevent race conditions and overdrafts.
 */
export const debitUserWallet = async ({ userId, amount, orderId, label = "Purchase" }) => {
  const validation = validateDebitWalletInput({ amount, orderId })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const numAmount = Number(amount)

  // 🔒 Atomic debit query: Ensures balance >= amount AT THE EXACT INSTANT OF WRITE (Race-condition safe!)
  const wallet = await Wallet.findOneAndUpdate(
    {
      user: userId,
      balance: { $gte: numAmount }
    },
    {
      $inc: { balance: -numAmount },
      $push: {
        transactions: {
          type: "DEBIT",
          amount: numAmount,
          label,
          reference: orderId || undefined,
          createdAt: new Date()
        }
      }
    },
    { new: true }
  )

  if (!wallet) {
    throw new ServiceError("Insufficient wallet balance or wallet not found", 400)
  }

  return { balance: wallet.balance }
}
