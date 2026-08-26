import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT", "REFUND"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, "Transaction amount must be positive"],
  },
  label: {
    type: String, // "Fund Added", "Purchase", "Refund"
    required: true,
  },
  reference: {
    type: String, // Order ID or Payment ID
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Wallet balance cannot be negative"],
    },
    transactions: [transactionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Wallet", walletSchema);
