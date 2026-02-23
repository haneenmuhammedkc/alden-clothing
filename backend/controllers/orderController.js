import Order from "../models/Order.js"
import Wallet from '../models/Wallet.js'
import Transaction from "../models/Transaction.js"

export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod
    } = req.body

    // Basic Validation (unchanged)
    if (
      !customer ||
      !customer.firstName ||
      !customer.phone ||
      !customer.email ||
      !customer.address?.line ||
      !customer.address?.city ||
      !customer.address?.state ||
      !customer.address?.pincode ||
      !items ||
      items.length === 0 ||
      typeof subtotal !== "number" ||
      typeof total !== "number" ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required order data"
      })
    }

    // Wallet Payment Logic
    let paymentStatus = "pending"
    let walletAfterBalance = null   // 🔥 track for transaction log

    if (paymentMethod?.toLowerCase() === "wallet") {
      const wallet = await Wallet.findOne({ user: req.user.id })

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found"
        })
      }

      if (wallet.balance < total) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance"
        })
      }

      // 1️⃣ Deduct wallet BEFORE order creation
      wallet.balance -= Number(total)

      wallet.transactions.push({
        type: "DEBIT",
        amount: total,
        label: "Purchase",
        reference: "ORDER_PENDING"
      })

      await wallet.save()

      walletAfterBalance = wallet.balance   // 🔥 store final balance
      paymentStatus = "paid"
    }

    // 2️⃣ CREATE ORDER (unchanged)
    const order = await Order.create({
      user: req.user?.id || null,
      customer,
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: "pending"
    })

    // ---------------------------
    // UPDATE WALLET TXN REFERENCE
    // ---------------------------
    if (paymentMethod?.toLowerCase() === "wallet") {
      const wallet = await Wallet.findOne({ user: req.user.id })
      const lastTxn = wallet.transactions[wallet.transactions.length - 1]

      lastTxn.reference = order._id.toString()
      await wallet.save()

      // 3️⃣ 🔥 LOG UNIFIED TRANSACTION
      await Transaction.create({
        user: req.user.id,
        type: "ORDER_PAYMENT",
        method: "WALLET",
        amount: Number(total),
        balanceAfter: walletAfterBalance,
        orderId: order._id,
        description: `Paid for Order #${order._id} (Wallet)`,
        status: "SUCCESS"
      })
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    })
  } catch (error) {
    console.error("Create Order Error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating order"
    })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) return res.status(404).json({ message: "Order not found" })

    const validTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: []
    }

    if (!validTransitions[order.orderStatus].includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" })
    }

    order.orderStatus = status
    await order.save()

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get orders of logged in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders"
    })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    })
  }
}

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    // Ensure user owns this order
    if (order.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      })
    }

    // Prevent cancelling delivered orders
    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled"
      })
    }

    order.orderStatus = "cancelled"
    order.paymentStatus = "failed"

    await order.save()

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order"
    })
  }
}

/* ================= ADMIN SALES REPORT ================= */
export const getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query

    let matchStage = {}

    // Date filter
    if (fromDate && toDate) {
      matchStage.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      }
    }

    /* ===== DAILY SALES TABLE ===== */
    const report = await Order.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalSales: { $sum: "$total" }, // change if your field is different
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

    /* ===== SUMMARY CARDS ===== */
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

    res.json({ report, summary })

  } catch (error) {
    console.error("Sales report error:", error)
    res.status(500).json({ message: "Server Error" })
  }
}