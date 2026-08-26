import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Badge from "../component/Badge"
import Button from "../component/Button"
import Modal from "../component/Modal"
import { Menu, Eye, ShoppingBag, CheckCircle2, Clock, XCircle, Search } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Orders — Alden Clothing Order Management Workspace
 */
const Admin_Orders = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      })
      setOrders(res.data.data || [])
    } catch (error) {
      console.error("Fetch Error:", error)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken")
      await axiosInstance.put(
        `/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all" && order.orderStatus?.toLowerCase() !== filter) return false

    if (
      searchTerm &&
      !order._id.toString().toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) return false

    if (selectedDate) {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0]
      if (orderDate !== selectedDate) return false
    }
    return true
  })

  const KPICard = ({ title, value, icon: IconComponent }) => (
    <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-5 flex items-center space-x-4 shadow-2xs">
      <div className="w-10 h-10 rounded-[6px] bg-[#F5EFE8] flex items-center justify-center text-[#8B634B] shrink-0 border border-[#DED4CB]/60">
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#76675D]">{title}</p>
        <h3 className="text-2xl font-bold text-[#30251F] font-sans">{value}</h3>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#30251F] font-sans md:pl-60 flex flex-col selection:bg-[#8B634B] selection:text-white">
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DED4CB]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">FULFILLMENT WORKSPACE</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">ORDER MANAGEMENT</h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-[4px] border border-[#DED4CB] text-[#30251F]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="TOTAL ORDERS" value={orders.length} icon={ShoppingBag} />
          <KPICard title="COMPLETED" value={orders.filter(o => o.orderStatus?.toLowerCase() === "delivered").length} icon={CheckCircle2} />
          <KPICard title="PENDING" value={orders.filter(o => o.orderStatus?.toLowerCase() === "pending").length} icon={Clock} />
          <KPICard title="CANCELLED" value={orders.filter(o => o.orderStatus?.toLowerCase() === "cancelled").length} icon={XCircle} />
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#76675D]" />
              <input
                type="text"
                placeholder="Search ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs uppercase text-[#30251F] focus:outline-none focus:border-[#8B634B]"
              />
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-2 px-3 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end overflow-x-auto">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-bold uppercase transition-colors cursor-pointer shrink-0 ${
                  filter === st
                    ? "bg-[#8B634B] text-white"
                    : "bg-[#F8FAFC] border border-[#DED4CB] text-[#76675D] hover:text-[#30251F]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Data Table Panel */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusVariant = 
                      order.orderStatus === "delivered" ? "success" :
                      order.orderStatus === "pending" ? "warning" :
                      order.orderStatus === "shipped" ? "info" : "default"

                    return (
                      <tr key={order._id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-3 font-semibold text-[#8B634B]">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-3 px-3 font-medium">{order.customer?.firstName} {order.customer?.lastName}</td>
                        <td className="py-3 px-3 text-[#76675D]">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3 uppercase font-medium">{order.paymentMethod}</td>
                        <td className="py-3 px-3 font-semibold">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="bg-transparent border border-[#DED4CB] rounded-[4px] px-2 py-1 text-xs font-semibold text-[#30251F]"
                          >
                            <option value="pending">PENDING</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowModal(true)
                            }}
                            className="p-1.5 text-[#8B634B] hover:bg-[#F5EFE8] rounded-[4px] cursor-pointer"
                            title="View Order Manifest"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-[#76675D] italic">No orders match filter criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Order Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`ORDER MANIFEST — #${selectedOrder?._id?.slice(-6)?.toUpperCase()}`}
      >
        {selectedOrder && (
          <div className="space-y-4 font-sans text-xs">
            <div className="bg-[#F5EFE8] p-3 rounded-[6px] border border-[#DED4CB] space-y-1">
              <p className="font-bold uppercase text-[#30251F]">
                CUSTOMER: {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
              </p>
              <p className="text-[#76675D]">EMAIL: {selectedOrder.customer?.email}</p>
              <p className="text-[#76675D]">PHONE: {selectedOrder.customer?.phone}</p>
              <p className="text-[#76675D]">
                ADDRESS: {selectedOrder.customer?.address?.line}, {selectedOrder.customer?.address?.city}, {selectedOrder.customer?.address?.state} — {selectedOrder.customer?.address?.pincode}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold uppercase tracking-wider text-[#30251F]">ORDERED ITEMS</p>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-[#DED4CB]/60">
                  <span>{item.name} × {item.quantity || item.qty}</span>
                  <span className="font-semibold">₹{(item.price * (item.quantity || item.qty)).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#DED4CB] flex justify-between font-bold text-sm text-[#8B634B]">
              <span>TOTAL VALUE:</span>
              <span>₹{(selectedOrder.total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Admin_Orders