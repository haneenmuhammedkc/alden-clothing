import PromoCode from "../models/PromoCode.js"
import { ServiceError } from "./serviceError.js"
import {
  validateCreatePromoInput,
  validateApplyPromoInput
} from "../validators/promoValidators.js"

/**
 * 🔒 Single Source of Truth for Promo Evaluation & Calculation:
 * Evaluates active status, expiry, usage limit, min cart subtotal, discount calculation, maxDiscount capping, and subtotal bounds.
 */
export const evaluatePromoCode = async ({ code, cartTotal }) => {
  const validation = validateApplyPromoInput({ code })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedCode = String(code).toUpperCase().trim()
  const numSubtotal = Math.max(0, Number(cartTotal) || 0)

  const promo = await PromoCode.findOne({
    code: normalizedCode,
    isActive: true
  })

  if (!promo) {
    throw new ServiceError("Invalid or inactive promo code", 400)
  }

  if (new Date(promo.expiryDate) < new Date()) {
    throw new ServiceError("Promo code has expired", 400)
  }

  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    throw new ServiceError("Promo code usage limit reached", 400)
  }

  if (numSubtotal < promo.minCartValue) {
    throw new ServiceError(
      `Minimum subtotal of ₹${promo.minCartValue} required for this promo code`,
      400
    )
  }

  let discount =
    promo.discountType === "percent"
      ? (numSubtotal * promo.discountValue) / 100
      : promo.discountValue

  if (promo.maxDiscount) {
    discount = Math.min(discount, promo.maxDiscount)
  }

  // Discount cannot exceed subtotal
  discount = Math.min(discount, numSubtotal)

  return {
    discount,
    promoId: promo._id,
    code: promo.code,
    promo
  }
}

/**
 * 🔒 Atomic usage count increment
 */
export const incrementPromoUsage = async (promoId) => {
  if (!promoId) return null
  return await PromoCode.findOneAndUpdate(
    { _id: promoId },
    { $inc: { usedCount: 1 } },
    { new: true }
  )
}

/**
 * Administrative promo creation with validation & uppercase normalization
 */
export const createAdminPromo = async ({
  code,
  discountType,
  discountValue,
  minCartValue,
  maxDiscount,
  expiryDate,
  usageLimit
}) => {
  const validation = validateCreatePromoInput({
    code,
    discountType,
    discountValue,
    expiryDate
  })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const normalizedCode = String(code).toUpperCase().trim()
  const numValue = Number(discountValue)

  try {
    const promo = await PromoCode.create({
      code: normalizedCode,
      discountType,
      discountValue: numValue,
      minCartValue: minCartValue ? Math.max(0, Number(minCartValue)) : 0,
      maxDiscount: maxDiscount ? Math.max(0, Number(maxDiscount)) : undefined,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit ? Math.max(1, Number(usageLimit)) : undefined
    })

    return promo
  } catch (err) {
    if (err.code === 11000) {
      throw new ServiceError("Promo code already exists", 400)
    }
    throw new ServiceError(err.message, 400)
  }
}

/**
 * Administrative promo listing
 */
export const fetchAdminPromos = async () => {
  return await PromoCode.find().sort({ createdAt: -1 })
}

/**
 * Administrative promo toggle
 */
export const toggleAdminPromo = async (promoId) => {
  const promo = await PromoCode.findById(promoId)
  if (!promo) {
    throw new ServiceError("Promo not found", 404)
  }

  promo.isActive = !promo.isActive
  await promo.save()

  return promo
}
