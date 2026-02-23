import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Category from "../models/Category.js"

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      productId,
      category,
      collectionName,
      color,
      sizes,
      price,
      description,
      stockQty,
      stockStatus,
      status,
      images
    } = req.body

    // Validate category exists
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" })
    }

    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Category not found" })
    }

    const product = new Product({
      name,
      productId,
      category,
      collectionName,
      color,
      sizes,
      price,
      description,
      stockQty,
      stockStatus,
      status,
      images: images || []
    })

    await product.save()

    res.status(201).json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error("Add Product Error:", error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getDeletedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: true })
      .populate("category", "name")
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const softDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isDeleted: true })
    res.status(200).json({ success: true, message: "Product soft deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    Object.assign(product, req.body)

    if (req.body.images) {
      product.images = req.body.images   // replace with new URLs
    }

    await product.save()

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const restoreProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isDeleted: false })
    res.status(200).json({ success: true, message: "Product restored successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}