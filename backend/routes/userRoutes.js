import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addAddress, changePassword, deleteAddress, forgotPassword, getAddresses, getMyProfile, resetPassword, setDefaultAddress, updateAddress, updateProfile } from "../controllers/userController.js"

const router = express.Router()

router.get("/me", authMiddleware(["user"]), getMyProfile)
router.put("/me", authMiddleware(["user"]), updateProfile)
router.put("/change-password", authMiddleware(["user"]), changePassword)
router.post("/address", authMiddleware(["user"]), addAddress)
router.get("/address", authMiddleware(["user"]), getAddresses)
router.put("/address/:addressId/default", authMiddleware(["user"]), setDefaultAddress)
router.delete("/address/:addressId", authMiddleware(["user"]), deleteAddress)
router.put("/address/:addressId", authMiddleware(["user"]), updateAddress)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router