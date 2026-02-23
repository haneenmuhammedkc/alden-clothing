import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { blockUnblockCustomer, getAllCustomers, getSingleCustomer } from "../controllers/adminCustomerController.js"

const router = express.Router()

router.get("/customers", authMiddleware(["admin"]), getAllCustomers)
router.get("/customers/:id", authMiddleware(["admin"]), getSingleCustomer)
router.patch("/customers/:id/status", authMiddleware(["admin"]), blockUnblockCustomer)

export default router