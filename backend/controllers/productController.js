import Product from '../models/Product.js'
import Category from "../models/Category.js"

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query
    let filter = { isDeleted: false }

    if (category) {
      const cat = await Category.findOne({ name: category })
      if (cat) {
        filter.category = cat._id
      }
    }

    const products = await Product.find(filter).populate("category")

    res.status(200).json({
      success: true,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getSingleProduct = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: product
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}