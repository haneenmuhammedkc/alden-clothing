import express from "express"
import { addProduct, getActiveProducts, getDeletedProducts, restoreProduct, softDeleteProduct, updateProduct } from "../controllers/adminProductController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(authMiddleware())

router.post("/add", addProduct) // Add Product
router.get("/", getActiveProducts) // Get Active Products
router.get("/deleted", getDeletedProducts) // Get Deleted Products
router.put("/soft-delete/:id", softDeleteProduct) // Soft Delete Product
router.put( "/update/:id", updateProduct) // Update Product
router.put("/restore/:id", restoreProduct)

export default router