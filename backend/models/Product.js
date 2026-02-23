import mongoose from "mongoose"
import slugify from "slugify"

const productSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, required: true, lowercase: true },
  productId: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  collectionName: String,
  color: String,
  sizes: [String],
  price: Number,
  description: { type: String, trim: true },
  stockQty: Number,
  stockStatus: String,
  status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active"
},
  images: { type: [String], default: [] },
  isDeleted: { type: Boolean , default: false },
})

productSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

export default mongoose.model("Product", productSchema)