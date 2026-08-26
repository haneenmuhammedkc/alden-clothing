import {
  createProduct,
  fetchActiveProductsAdmin,
  fetchDeletedProductsAdmin,
  softDeleteProduct as softDeleteProductService,
  updateProduct as updateProductService,
  restoreProduct as restoreProductService
} from "../services/productService.js"

export const addProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body)
    return res.status(201).json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error("Add Product Error:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}

export const getActiveProducts = async (req, res) => {
  try {
    const products = await fetchActiveProductsAdmin()
    return res.status(200).json({ success: true, data: products })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const getDeletedProducts = async (req, res) => {
  try {
    const products = await fetchDeletedProductsAdmin()
    return res.status(200).json({ success: true, data: products })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const softDeleteProduct = async (req, res) => {
  try {
    const result = await softDeleteProductService(req.params.id)
    return res.status(200).json({ success: true, message: result.message })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(req.params.id, req.body)
    return res.status(200).json({ success: true, data: product })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const restoreProduct = async (req, res) => {
  try {
    const result = await restoreProductService(req.params.id)
    return res.status(200).json({ success: true, message: result.message })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}