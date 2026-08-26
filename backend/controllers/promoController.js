import {
  createAdminPromo,
  fetchAdminPromos,
  evaluatePromoCode,
  toggleAdminPromo
} from "../services/promoService.js"

export const createPromo = async (req, res) => {
  try {
    const promo = await createAdminPromo(req.body)
    return res.status(201).json({ success: true, promo })
  } catch (err) {
    const statusCode = err.statusCode || 400
    return res.status(statusCode).json({ success: false, message: err.message })
  }
}

export const getPromos = async (req, res) => {
  try {
    const promos = await fetchAdminPromos()
    return res.json({ success: true, promos })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: "Failed to fetch promos" })
  }
}

export const applyPromo = async (req, res) => {
  try {
    const { code, cartTotal } = req.body
    const result = await evaluatePromoCode({ code, cartTotal })

    return res.json({
      success: true,
      discount: result.discount,
      promoId: result.promoId,
      code: result.code
    })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: err.message })
  }
}

export const togglePromo = async (req, res) => {
  try {
    const promo = await toggleAdminPromo(req.params.id)
    return res.json({ success: true, promo })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({ success: false, message: "Failed to toggle promo code" })
  }
}