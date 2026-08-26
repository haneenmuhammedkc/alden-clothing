import Order from "../models/Order.js"
import Transaction from "../models/Transaction.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import { ServiceError } from "./serviceError.js"
import { debitUserWallet } from "./walletService.js"
import { evaluatePromoCode, incrementPromoUsage } from "./promoService.js"
import {
  validateCreateOrderInput,
  validateOrderIdInput,
  validateOrderStatusInput
} from "../validators/orderValidators.js"

/**
 * 🔒 Create Order Business Workflow:
 * 1. Validate request payload using orderValidators
 * 2. Check blocked user status
 * 3. Re-verify item price & stock against authoritative MongoDB Product data
 * 4. Re-verify promo code validity & calculate server-side discount via promoService
 * 5. Compute server-side financial totals (tax, shipping, total)
 * 6. Process atomic wallet deduction if paymentMethod === 'wallet' via walletService
 * 7. Create Order document
 * 8. Increment promo usedCount atomically via promoService
 * 9. Log unified transaction record
 */
export const createNewOrder = async ({
  userId,
  customer,
  items,
  promoCode,
  paymentMethod
}) => {
  // 1. Request Input Validation
  const validation = validateCreateOrderInput({ customer, items, paymentMethod })
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  // 🔒 2. Blocked User Check (Business Rule)
  const dbUser = await User.findById(userId)
  if (!dbUser || dbUser.status === "Blocked") {
    throw new ServiceError("Your account has been blocked by an administrator.", 403)
  }

  // 🔒 3. Trust Boundary Enforcement: Re-verify every item against authoritative MongoDB Product data (Business Rule)
  const verifiedItems = []
  let computedSubtotal = 0

  for (const item of items) {
    const prodId = item.productId || item._id
    const dbProduct = await Product.findById(prodId)

    if (!dbProduct || dbProduct.isDeleted || dbProduct.status !== "active") {
      throw new ServiceError(`Product "${item.name || 'item'}" is no longer available.`, 400)
    }

    const itemQty = Math.max(1, Math.floor(Number(item.quantity || item.qty) || 1))

    if (dbProduct.stockQty !== undefined && dbProduct.stockQty < itemQty) {
      throw new ServiceError(
        `Insufficient stock for product "${dbProduct.name}". Only ${dbProduct.stockQty} available.`,
        400
      )
    }

    const authoritativePrice = Number(dbProduct.price)
    const lineTotal = authoritativePrice * itemQty
    computedSubtotal += lineTotal

    verifiedItems.push({
      productId: dbProduct._id,
      name: dbProduct.name,
      sku: dbProduct.productId || item.sku || "",
      image: dbProduct.images?.[0] || item.image || "",
      price: authoritativePrice, // 🔒 Authoritative catalog price
      quantity: itemQty,
      size: String(item.size || "").trim(),
      color: String(item.color || dbProduct.color || "").trim()
    })
  }

  // 🔒 4. Compute Server-Side Promo Code Discount & Re-Verify Promo Validity via promoService
  let numDiscount = 0
  let validatedPromo = null

  if (promoCode) {
    const rawCode = typeof promoCode === "string" ? promoCode : promoCode.code
    if (rawCode) {
      try {
        const promoRes = await evaluatePromoCode({ code: rawCode, cartTotal: computedSubtotal })
        numDiscount = promoRes.discount
        validatedPromo = promoRes
      } catch (err) {
        // Soft fail for checkout if promo is invalid/expired
        numDiscount = 0
        validatedPromo = null
      }
    }
  }

  // 🔒 5. Compute Server-Side Financial Totals (Business Rule)
  const computedShipping = computedSubtotal > 5000 ? 0 : 200
  const computedTax = Math.round(computedSubtotal * 0.08)
  const computedTotal = Math.max(0, computedSubtotal + computedShipping + computedTax - numDiscount)

  // Unique human-readable Order Identifier
  const customOrderId = `ALD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`

  // Wallet Payment Logic (Atomic & Concurrency-Safe Business Rule via walletService)
  let paymentStatus = "pending"
  let walletAfterBalance = null

  if (String(paymentMethod).toLowerCase() === "wallet") {
    // 1️⃣ Atomic wallet deduction delegating to walletService
    const walletRes = await debitUserWallet({
      userId,
      amount: computedTotal,
      orderId: customOrderId,
      label: "Purchase"
    })
    walletAfterBalance = walletRes.balance
    paymentStatus = "paid"
  }

  // 2️⃣ CREATE ORDER document
  const order = await Order.create({
    orderId: customOrderId,
    user: userId || null,
    customer,
    items: verifiedItems,
    subtotal: computedSubtotal,
    discount: numDiscount,
    tax: computedTax,
    shipping: computedShipping,
    total: computedTotal,
    promoCode: validatedPromo ? { code: validatedPromo.code, discountAmount: numDiscount } : undefined,
    paymentMethod,
    paymentStatus,
    orderStatus: "pending"
  })

  // 🔒 2b. Atomic PromoCode usedCount Increment via promoService
  if (validatedPromo && validatedPromo.promoId) {
    await incrementPromoUsage(validatedPromo.promoId)
  }

  // 3️⃣ LOG UNIFIED TRANSACTION RECORD
  if (String(paymentMethod).toLowerCase() === "wallet") {
    await Transaction.create({
      user: userId,
      type: "ORDER_PAYMENT",
      method: "WALLET",
      amount: computedTotal,
      balanceAfter: walletAfterBalance,
      orderId: order._id,
      description: `Paid for Order #${order.orderId || order._id} (Wallet)`,
      status: "SUCCESS"
    })
  }

  return order
}

export const fetchAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 })
}

export const fetchUserOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 })
}

export const fetchOrderById = async (orderId, userId, role) => {
  const validation = validateOrderIdInput(orderId)
  if (!validation.isValid) {
    throw new ServiceError(validation.message, 400)
  }

  const order = await Order.findById(orderId)
  if (!order) {
    throw new ServiceError("Order not found", 404)
  }

  // 🔒 IDOR Security Enforcer: Ensure customer owns order OR request is from Admin
  if (order.user?.toString() !== userId && role !== "admin") {
    throw new ServiceError("Access denied. You can only view your own orders.", 403)
  }

  return order
}

export const updateOrderStatusById = async (orderId, status) => {
  const idValidation = validateOrderIdInput(orderId)
  if (!idValidation.isValid) {
    throw new ServiceError(idValidation.message, 400)
  }

  const statusValidation = validateOrderStatusInput(status)
  if (!statusValidation.isValid) {
    throw new ServiceError(statusValidation.message, 400)
  }

  const order = await Order.findById(orderId)
  if (!order) {
    throw new ServiceError("Order not found", 404)
  }

  const validTransitions = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: []
  }

  if (!validTransitions[order.orderStatus]?.includes(status)) {
    throw new ServiceError("Invalid status transition", 400)
  }

  order.orderStatus = status
  await order.save()

  return order
}

export const cancelOrderById = async (orderId, userId, role, reason) => {
  const idValidation = validateOrderIdInput(orderId)
  if (!idValidation.isValid) {
    throw new ServiceError(idValidation.message, 400)
  }

  const order = await Order.findById(orderId)
  if (!order) {
    throw new ServiceError("Order not found", 404)
  }

  // 🔒 Ensure user owns this order OR request is from Admin
  if (order.user?.toString() !== userId && role !== "admin") {
    throw new ServiceError("Unauthorized", 403)
  }

  // Prevent cancelling delivered orders
  if (order.orderStatus === "delivered") {
    throw new ServiceError("Delivered orders cannot be cancelled", 400)
  }

  order.orderStatus = "cancelled"
  order.paymentStatus = "failed"
  order.cancellation = {
    reason: reason || "Cancelled by user",
    cancelledAt: new Date(),
    cancelledBy: role === "admin" ? "admin" : "customer"
  }

  await order.save()

  return order
}

export const generateSalesReportData = async (fromDate, toDate) => {
  let matchStage = {}

  if (fromDate && toDate) {
    matchStage.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate)
    }
  }

  const report = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        totalSales: { $sum: "$total" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalSales: 1,
        orders: 1
      }
    }
  ])

  const summaryAgg = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
        totalOrders: { $sum: 1 }
      }
    }
  ])

  const data = summaryAgg[0] || {
    totalRevenue: 0,
    totalOrders: 0
  }

  const summary = {
    totalRevenue: data.totalRevenue,
    totalOrders: data.totalOrders,
    avgOrderValue:
      data.totalOrders > 0
        ? Math.round(data.totalRevenue / data.totalOrders)
        : 0
  }

  return { report, summary }
}
