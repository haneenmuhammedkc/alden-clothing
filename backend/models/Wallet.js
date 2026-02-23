import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  label: {
    type: String, // "Fund Added", "Purchase"
    required: true
  },
  reference: {
    type: String // Order ID or Payment ID
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema]
})

export default mongoose.model("Wallet", walletSchema)