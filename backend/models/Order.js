import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Custom human-readable Order Identifier
    orderId: { type: String, unique: true, sparse: true, trim: true },

    // User who placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Customer details snapshot
    customer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      addressType: {
        type: String,
        enum: ["Home", "Office", "Work", "Other"],
        default: "Home",
      },
      address: {
        line: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
    },

    // Purchased items snapshot with exact selected size & color
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true, trim: true },
        sku: { type: String, trim: true },
        image: { type: String },
        price: {
          type: Number,
          required: true,
          min: [0, "Item price cannot be negative"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        size: { type: String, trim: true },
        color: { type: String, trim: true },
      },
    ],

    // Price breakdown with non-negative validation
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    tax: { type: Number, required: true, min: [0, "Tax cannot be negative"] },
    shipping: {
      type: Number,
      required: true,
      min: [0, "Shipping cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },

    // Applied Promo Code snapshot
    promoCode: {
      code: { type: String, trim: true },
      discountAmount: { type: Number, default: 0, min: 0 },
    },

    // Payment info
    paymentMethod: {
      type: String,
      enum: ["razorpay", "wallet", "cod"],
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpay: {
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
    },

    // Order status lifecycle
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // Cancellation & Refund tracking
    cancellation: {
      reason: { type: String, trim: true },
      cancelledAt: { type: Date },
      cancelledBy: { type: String, enum: ["customer", "admin", "system"] },
    },
    refund: {
      amount: { type: Number, default: 0, min: 0 },
      status: {
        type: String,
        enum: ["none", "pending", "completed", "failed"],
        default: "none",
      },
      refundedAt: { type: Date },
      transactionId: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ "customer.email": 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
