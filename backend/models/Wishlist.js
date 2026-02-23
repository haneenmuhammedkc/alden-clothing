import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  items:[Object]
})

export default mongoose.model("Wishlist", wishlistSchema)