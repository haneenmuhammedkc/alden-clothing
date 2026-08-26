import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Badge from "../component/Badge"
import Button from "../component/Button"
import { Package, Clock, Truck, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

const statusConfig = {
  pending: { icon: Clock, variant: "warning" },
  processing: { icon: Package, variant: "info" },
  shipped: { icon: Truck, variant: "info" },
  delivered: { icon: CheckCircle2, variant: "success" },
  cancelled: { icon: XCircle, variant: "danger" }
}

/**
 * MyOrders — Alden Clothing Timeless Editorial Luxury Customer Orders Workspace
 */
const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axiosInstance.get("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrders(res.data.data || [])
      } catch (error) {
        console.error("Fetch Orders Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

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

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("userToken")
      await axiosInstance.put(
        `/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#DED4CB]">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#76675D] hover:text-[#30251F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ACCOUNT DASHBOARD</span>
            </button>

            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
              MY ORDER HISTORY ({orders.length})
            </h1>
          </div>

          {/* Controls: Search, Sort, Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="SEARCH ORDERS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 px-3 bg-[#FBF9F6] border border-[#DED4CB] rounded-[4px] text-xs uppercase text-[#30251F] placeholder-[#76675D]/60 focus:outline-none focus:border-[#8B634B]"
            />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-10 px-3 bg-[#FBF9F6] border border-[#DED4CB] rounded-[4px] text-xs uppercase font-semibold text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            >
              <option value="newest">NEWEST FIRST</option>
              <option value="oldest">OLDEST FIRST</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3 bg-[#FBF9F6] border border-[#DED4CB] rounded-[4px] text-xs uppercase font-semibold text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            >
              <option value="all">ALL STATUS</option>
              <option value="pending">PENDING</option>
              <option value="processing">PROCESSING</option>
              <option value="shipped">SHIPPED</option>
              <option value="delivered">DELIVERED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Orders Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-2 border-[#DED4CB] border-t-[#8B634B] rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#76675D]">Loading Orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-12 text-center space-y-4 max-w-lg mx-auto">
            <Package className="w-12 h-12 text-[#76675D] mx-auto" />
            <h2 className="text-xl font-serif text-[#30251F]">NO ORDERS FOUND</h2>
            <p className="text-xs text-[#76675D]">No orders match your search or selected status filter.</p>
            <div className="pt-2">
              <Button variant="primary" onClick={() => navigate("/men")}>EXPLORE CATALOG</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.orderStatus] || statusConfig.pending
              const shortId = order._id.slice(-6).toUpperCase()
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              })

              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-4 shadow-xs hover:border-[#8B634B] transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DED4CB]/60">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-[#30251F]">
                      <span className="text-[#8B634B]">ORDER #{shortId}</span>
                      <span className="text-[#DED4CB]">•</span>
                      <span className="text-[#76675D]">{orderDate}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={status.variant}>
                        {order.orderStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-24 bg-[#F5EFE8] rounded-[6px] overflow-hidden border border-[#DED4CB]/60 shrink-0">
                      {order.items[0] && (
                        <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <p className="text-sm font-semibold text-[#30251F]">
                        {order.items.map(i => i.name).join(", ")}
                      </p>
                      <p className="text-xs text-[#76675D]">
                        {order.items.length} ITEM(S) • VIA {order.paymentMethod?.toUpperCase()}
                      </p>
                      <p className="text-base font-bold text-[#8B634B] pt-1">
                        ₹{(order.total || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {["pending", "processing", "shipped"].includes(order.orderStatus) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelOrder(order._id)
                          }}
                          className="px-3 py-1.5 border border-[#8C2727] text-[#8C2727] text-xs font-semibold rounded-[4px] hover:bg-[#8C2727] hover:text-white transition-colors cursor-pointer"
                        >
                          CANCEL ORDER
                        </button>
                      )}
                      
                      <Button variant="secondary" className="text-xs">
                        VIEW DETAILS
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default MyOrders