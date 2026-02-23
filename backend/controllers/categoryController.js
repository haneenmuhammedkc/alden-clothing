import Category from "../models/Category.js"

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.json({ data: categories })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" })
  }
}

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ message: "Category name is required" })
    }

    const exists = await Category.findOne({ name })
    if (exists) {
      return res.status(400).json({ message: "Category already exists" })
    }

    const category = await Category.create({ name, description })
    res.status(201).json(category)

  } catch (error) {
    console.error("Add Category Error:", error)
    res.status(500).json({ message: "Failed to add category" })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    )

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category updated", category })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}