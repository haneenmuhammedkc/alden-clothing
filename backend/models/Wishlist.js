import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Stores product._id string for frontend compatibility
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
  image: { type: String },
  color: { type: String, trim: true },
  addedAt: { type: Date, default: Date.now },
});

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔒 One wishlist per user
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Wishlist", wishlistSchema);
