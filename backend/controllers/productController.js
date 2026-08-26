import {
  fetchPublicProducts,
  fetchProductById
} from "../services/productService.js"

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query
    const products = await fetchPublicProducts({ category })

    return res.status(200).json({
      success: true,
      data: products
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}

export const getSingleProduct = async (req, res) => {
  try {
    const product = await fetchProductById(req.params.id)

    return res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message
    })
  }
}