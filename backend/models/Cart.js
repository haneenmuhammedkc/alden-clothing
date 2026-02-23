import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      image: String,
      color: String,
      size: String,
      qty: Number
    }
  ]
},{timestamps:true})

export default mongoose.model("Cart", cartSchema)