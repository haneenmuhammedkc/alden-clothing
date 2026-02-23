import express from "express"
import { getCategories, addCategory, updateCategory } from "../controllers/categoryController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware(["admin"]), getCategories)
router.post("/add", authMiddleware(["admin"]), addCategory)
router.put("/:id", authMiddleware(["admin"]), updateCategory)

export default router