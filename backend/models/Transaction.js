import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["WALLET_CREDIT", "ORDER_PAYMENT"],
      required: true
    },

    method: {
      type: String,
      enum: ["WALLET", "RAZORPAY"],
      required: function () {
        return this.type === "ORDER_PAYMENT"
      }
    },

    amount: {
      type: Number,
      required: true
    },

    balanceAfter: {
      type: Number // only for wallet txns
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    }
  },
  { timestamps: true }
)

export default mongoose.model("Transaction", transactionSchema)