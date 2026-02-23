import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    // Customer details snapshot
    customer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      phone: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      addressType: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
      address: {
        line: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
      }
    },

    // Ordered items snapshot
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      image: { type: String },
      price: {type: Number, required: true },
      quantity: { type: Number, required: true }
    }],

    // Price breakdown
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },

    // Payment info
    paymentMethod: { type: String, enum: ["razorpay", "wallet", "cod"], default: "razorpay" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpay: { orderId: { type: String }, paymentId: { type: String }, signature: { type: String } },

    // Order status
    orderStatus: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model("Order", orderSchema)

export default Order