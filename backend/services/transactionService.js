import Transaction from "../models/Transaction.js"
import { ServiceError } from "./serviceError.js"
import { validateTransactionQueryUser } from "../validators/transactionValidators.js"

/**
 * Retrieves customer transaction history (IDOR-protected to authenticated userId)
 */
export const fetchUserTransactions = async (userId) => {
  const validation = validateTransactionQueryUser(userId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  return await Transaction.find({ user: userId })
    .populate("orderId", "orderId items total")
    .sort({ createdAt: -1 })
}

/**
 * Retrieves full system-wide financial transaction ledger for admin reporting
 */
export const fetchAllAdminTransactions = async () => {
  return await Transaction.find()
    .populate("user", "name email")
    .populate("orderId", "orderId total")
    .sort({ createdAt: -1 })
}
