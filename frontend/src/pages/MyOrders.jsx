import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react"
import { FiArrowLeft } from "react-icons/fi"

// Associates each order status with its corresponding icon
const statusConfig = {
  pending: { icon: Clock },
  processing: { icon: Package },
  shipped: { icon: Truck },
  delivered: { icon: CheckCircle2 },
  cancelled: { icon: XCircle }
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const navigate = useNavigate()

  // Fetch logged-in user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axios.get("http://localhost:4001/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setOrders(res.data.data)
      }catch(error){
        console.error("Fetch Orders Error:", error)
      }finally{
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Search, Status and Sort
  const filteredOrders = useMemo(() => {
    const processed = orders
      .map((order) => {
        const filteredItems = order.items.filter((item) => {
          const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())

          const matchesStatus = selectedStatus === "all" || order.orderStatus === selectedStatus

          return matchesSearch && matchesStatus
        })

        return { ...order, items: filteredItems }
      })
      .filter((order) => order.items.length > 0)

    processed.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return new Date(a.createdAt) - new Date(b.createdAt)
    })

    return processed
  }, [orders, searchTerm, selectedStatus, sortOrder])

  // Cancel a specific order
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("userToken")
      await axios.put(
        `http://localhost:4001/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "cancelled" } : order
        )
      )
    } catch (error) {
      alert(error.response?.data?.message || "Unable to cancel order")
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-8xl mx-auto px-20 pt-30 pb-32">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-5">
          <div className="flex items-start gap-6">
            <motion.button whileHover={{ x: -5 }} onClick={() => navigate("/profile")}
              className="p-3 border border-black rounded-full cursor-pointer hover:bg-black/5 hover:text-black transition-all">
              <FiArrowLeft />
            </motion.button>
            <div>
              <h1 className="text-4xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                Order <span className="text-gray-500">List</span>
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 mb-10">

          {/* Search */}
          <input type="text" placeholder="Search your orders here" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b border-black/10 py-4 font-mono text-sm focus:outline-none"/>

          {/* Sort */}
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent border border-black/10 px-8 py-4 text-[10px] font-mono uppercase tracking-widest">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {/* Status Filter */}
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border border-black/10 px-8 py-4 text-[10px] font-mono uppercase tracking-widest">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders */}
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders match your search.</p>
        ) : (
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.orderStatus]
              const StatusIcon = status?.icon || Package

              const previewItem = order.items?.[0]
              const itemNames = order.items.map(item => item.name).join(", ")
              const shortId = order._id.slice(-6).toUpperCase()
              const orderDate = new Date(order.createdAt).toLocaleDateString()

              return (
                <motion.div key={order._id} layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }} whileHover={{ y: -2 }} onClick={() => navigate(`/orders/${order._id}`)}
                  className="group relative bg-white border border-black/5 rounded-2xl p-6 cursor-pointer
                  hover:shadow-xl transition-all duration-300">

                  {/* Top Order Detail Section */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-black/40">
                      <span>Order #{shortId}</span>
                      <span>•</span>
                      <span>{orderDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-black/40">
                      <StatusIcon size={14}/> {order.orderStatus}
                    </div>
                  </div>

                  {/* MAIN CONTENT */}
                  <div className="flex items-center gap-6">

                    {/* Image Section */}
                    <div className="relative w-24 h-28">
                      
                      {/* Back Image */}
                      {order.items[1] && (
                        <img src={order.items[1].image} alt="preview-back" className="absolute top-1.5 left-1.5 w-full h-full
                          object-cover rounded-xl border border-black/10 bg-gray-50 opacity-80 scale-[0.96]"/>
                      )}

                      {/* Front Image */}
                      {order.items[0] && (
                        <img src={order.items[0].image} alt={order.items[0].name} className="relative w-full h-full object-cover
                          rounded-xl border border-black/10 bg-gray-50 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105"/>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase tracking-wide leading-snug">
                        {itemNames}
                      </p>

                      {/* Item Count Badge */}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {order.items.length > 1 && (
                          <span className="text-[10px] px-2 py-1 border border-black/10 rounded-full font-mono uppercase">
                            {order.items.length} items
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-1 border border-black/10 rounded-full font-mono uppercase">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="text-lg font-bold italic mt-3"> ₹ {order.total} </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/5">
                    <p className="text-[10px] font-mono uppercase text-black/40"> Tap to view full order details </p>

                    {["pending","processing","shipped"].includes(order.orderStatus) && (
                      <button onClick={(e)=>{
                          e.stopPropagation()
                          handleCancelOrder(order._id)
                        }}
                        className="text-xs border border-red-400 text-red-600 rounded-md px-3 py-1
                        hover:bg-red-50 transition-all">
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyOrders