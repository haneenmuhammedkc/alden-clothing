import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["review", "report"], default: "review" },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// 🔒 Database-level partial unique index: Enforces ONE review per user per product
feedbackSchema.index(
  { user: 1, product: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: "review" } },
);

feedbackSchema.index({ product: 1, type: 1, createdAt: -1 });
feedbackSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Feedback", feedbackSchema);
