import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["WALLET_CREDIT", "WALLET_DEBIT", "ORDER_PAYMENT", "REFUND"],
      required: true,
    },

    method: {
      type: String,
      enum: ["WALLET", "RAZORPAY", "COD"],
      required: function () {
        return this.type === "ORDER_PAYMENT";
      },
    },

    // Database-level Unique Reference Key for Idempotency (Razorpay Payment ID, Wallet Ref, Refund ID)
    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0.01, "Transaction amount must be positive"],
    },

    balanceAfter: {
      type: Number,
      min: [0, "Balance after transaction cannot be negative"],
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING", "REFUNDED"],
      default: "SUCCESS",
    },
  },
  { timestamps: true },
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ orderId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
