import User from "../models/User.js"

// Get all customers with order count
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.aggregate([
      { $lookup: { from: "orders", localField: "_id", foreignField: "user", as: "orders" } },
      { $addFields: { ordersCount: { $size: "$orders" } } },
      { $project: { password: 0, orders: 0 } }
    ])
    res.json({ customers })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single customer
export const getSingleCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Block / Unblock
export const blockUnblockCustomer = async (req, res) => {
  try {
    const { status } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    res.json({ message: "Status updated", user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}