import Category from "../models/Category.js"
import { escapeRegex } from "../utils/regexUtils.js"
import { ServiceError } from "./serviceError.js"
import {
  validateCreateCategoryInput,
  validateCategoryIdInput
} from "../validators/categoryValidators.js"

export const fetchCategories = async () => {
  return await Category.find().sort({ createdAt: -1 })
}

export const createCategory = async ({ name, description, status }) => {
  const validation = validateCreateCategoryInput({ name })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const trimmedName = String(name).trim()
  const trimmedDesc = description ? String(description).trim() : undefined

  // 🔒 Case-insensitive duplicate check with regex escaping
  const exists = await Category.findOne({
    name: new RegExp(`^${escapeRegex(trimmedName)}$`, "i")
  })

  if (exists) {
    throw new ServiceError("Category already exists", 400)
  }

  try {
    const category = await Category.create({
      name: trimmedName,
      description: trimmedDesc,
      status: status && ["Active", "Inactive"].includes(status) ? status : "Active"
    })
    return category
  } catch (error) {
    if (error.code === 11000) {
      throw new ServiceError("Category already exists", 400)
    }
    throw new ServiceError("Failed to add category", 500)
  }
}

export const updateCategoryById = async (id, { name, description, status }) => {
  const idValidation = validateCategoryIdInput(id)
  if (!idValidation.isValid) {
    throw new ServiceError(idValidation.message, 400)
  }

  const updateFields = {}

  if (name !== undefined) {
    if (!String(name).trim()) {
      throw new ServiceError("Category name cannot be empty", 400)
    }
    const trimmedName = String(name).trim()

    // 🔒 Case-insensitive duplicate check against other categories
    const exists = await Category.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${escapeRegex(trimmedName)}$`, "i")
    })

    if (exists) {
      throw new ServiceError("Category already exists", 400)
    }

    updateFields.name = trimmedName
  }

  if (description !== undefined) {
    updateFields.description = String(description).trim()
  }

  if (status !== undefined) {
    if (!["Active", "Inactive"].includes(status)) {
      throw new ServiceError("Invalid status value", 400)
    }
    updateFields.status = status
  }

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    )

    if (!category) {
      throw new ServiceError("Category not found", 404)
    }

    return category
  } catch (error) {
    if (error.code === 11000) {
      throw new ServiceError("Category already exists", 400)
    }
    throw new ServiceError(error.message, 500)
  }
}
