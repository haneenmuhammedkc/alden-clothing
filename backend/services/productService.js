import Product from "../models/Product.js"
import Category from "../models/Category.js"
import { escapeRegex } from "../utils/regexUtils.js"
import { ServiceError } from "./serviceError.js"
import {
  validateCreateProductInput,
  validateProductIdInput
} from "../validators/productValidators.js"

export const fetchPublicProducts = async ({ category }) => {
  let filter = { isDeleted: false }

  if (category && String(category).trim()) {
    const trimmedCat = String(category).trim()
    // 🔒 Case-insensitive category lookup with regex escaping
    const cat = await Category.findOne({
      name: new RegExp(`^${escapeRegex(trimmedCat)}$`, "i")
    })

    if (cat) {
      filter.category = cat._id
    } else {
      // If category query was passed but doesn't exist, return empty array cleanly
      return []
    }
  }

  return await Product.find(filter).populate("category")
}

export const fetchProductById = async (id) => {
  const validation = validateProductIdInput(id)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const product = await Product.findById(id)
  if (!product) {
    throw new ServiceError("Product not Found", 404)
  }

  return product
}

export const createProduct = async (productData) => {
  const validation = validateCreateProductInput(productData)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const { category } = productData
  const categoryExists = await Category.findById(category)
  if (!categoryExists) {
    throw new ServiceError("Category not found", 400)
  }

  const product = new Product({
    name: productData.name,
    productId: productData.productId,
    category: productData.category,
    collectionName: productData.collectionName,
    color: productData.color,
    sizes: productData.sizes,
    price: productData.price,
    description: productData.description,
    stockQty: productData.stockQty,
    stockStatus: productData.stockStatus,
    status: productData.status,
    images: productData.images || []
  })

  await product.save()
  return product
}

export const fetchActiveProductsAdmin = async () => {
  return await Product.find({ isDeleted: { $ne: true } }).populate("category", "name")
}

export const fetchDeletedProductsAdmin = async () => {
  return await Product.find({ isDeleted: true }).populate("category", "name")
}

export const softDeleteProduct = async (id) => {
  const validation = validateProductIdInput(id)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
  if (!product) {
    throw new ServiceError("Product not found", 404)
  }

  return { message: "Product soft deleted" }
}

export const updateProduct = async (id, updateData) => {
  const validation = validateProductIdInput(id)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const product = await Product.findById(id)
  if (!product) {
    throw new ServiceError("Product not found", 404)
  }

  Object.assign(product, updateData)

  if (updateData.images) {
    product.images = updateData.images
  }

  await product.save()
  return product
}

export const restoreProduct = async (id) => {
  const validation = validateProductIdInput(id)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const product = await Product.findByIdAndUpdate(id, { isDeleted: false }, { new: true })
  if (!product) {
    throw new ServiceError("Product not found", 404)
  }

  return { message: "Product restored successfully" }
}
