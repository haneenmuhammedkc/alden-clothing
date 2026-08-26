import {
  fetchCategories,
  createCategory,
  updateCategoryById
} from "../services/categoryService.js"

export const getCategories = async (req, res) => {
  try {
    const categories = await fetchCategories()
    return res.json({ success: true, data: categories })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: "Failed to fetch categories" })
  }
}

export const addCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body
    const category = await createCategory({ name, description, status })
    return res.status(201).json({ success: true, category })
  } catch (error) {
    console.error("Add Category Error:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message || "Failed to add category" })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, status } = req.body
    const category = await updateCategoryById(id, { name, description, status })

    return res.json({ success: true, message: "Category updated", category })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message })
  }
}