import {
  createNewOrder,
  fetchAllOrders,
  fetchUserOrders,
  fetchOrderById,
  updateOrderStatusById,
  cancelOrderById,
  generateSalesReportData
} from "../services/orderService.js"

export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      promoCode,
      paymentMethod
    } = req.body

    const order = await createNewOrder({
      userId: req.user?.id,
      customer,
      items,
      promoCode,
      paymentMethod
    })

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    })
  } catch (error) {
    console.error("Create Order Error:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server error while creating order"
    })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await fetchAllOrders()

    return res.status(200).json({
      success: true,
      data: orders
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch orders"
    })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await updateOrderStatusById(req.params.id, status)

    return res.json({ success: true, data: order })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await fetchUserOrders(req.user.id)

    return res.status(200).json({
      success: true,
      data: orders
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch user orders"
    })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await fetchOrderById(req.params.id, req.user.id, req.user.role)

    return res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch order"
    })
  }
}

export const cancelOrder = async (req, res) => {
  try {
    const order = await cancelOrderById(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body.reason
    )

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to cancel order"
    })
  }
}

export const getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query
    const { report, summary } = await generateSalesReportData(fromDate, toDate)

    return res.json({ report, summary })
  } catch (error) {
    console.error("Sales report error:", error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ message: error.message || "Server Error" })
  }
}