import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Stores product._id string for frontend compatibility
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
  image: { type: String },
  color: { type: String, trim: true },
  size: { type: String, trim: true },
  qty: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔒 One cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Cart", cartSchema);
