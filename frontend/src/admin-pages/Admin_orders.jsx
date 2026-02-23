import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars, FaTrash, FaEye } from "react-icons/fa"
import axios from "axios"
import { assets } from "../assets/assets"

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
      const res = await axios.get("http://localhost:4001/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      })
      setOrders(res.data.data)
    } catch (error) {
      console.error("Fetch Error:", error)
    }
  }

  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filter !== "all" && order.orderStatus?.toLowerCase() !== filter) return false

    // Search filter
    if (
      searchTerm &&
      !order._id.toString().toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    ) return false

    // Date filter
    if (selectedDate) {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0]
      if (orderDate !== selectedDate) return false
    }
    return true
  })

  const Card = ({ title, value, subText, iconBg, icon }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${iconBg}`}> {icon} </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <p className="text-gray-400 text-xs">{subText}</p>
        </div>
      </div>
  )}

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-600",
    processing: "bg-blue-100 text-blue-600",
    shipped: "bg-purple-100 text-purple-600",
    delivered: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  }

return (
  <div className="w-full h-screen flex flex-col md:flex-row bg-gray-100 pl-27.5 overflow-hidden">
      {/* Sidebar */}
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
          <FaBars onClick={() => setMobileMenuOpen(true)} className="text-2xl text-gray-600 cursor-pointer md:hidden"/>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card title="Total Orders" value={orders.length} subText="All orders received" iconBg="bg-blue-500" icon={<FaEye />}/>
          <Card title="Completed" value={orders.filter(o => o.orderStatus?.toLowerCase() === "delivered").length} subText="Successfully delivered" 
            iconBg="bg-green-500" icon={<FaEye />} />
          <Card title="Pending" value={orders.filter(o => o.orderStatus?.toLowerCase() === "pending").length} subText="Awaiting processing" 
            iconBg="bg-yellow-500" icon={<FaEye />} />
          <Card title="Cancelled" value={orders.filter(o => o.orderStatus?.toLowerCase() === "cancelled").length} subText="Cancelled by users/admin" 
            iconBg="bg-red-500" icon={<FaTrash />} />
        </div>

        {/* Search + Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-stretch bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">

            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><img src={assets.search_icon} className="w-5" /></span>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Order ID or Customer"
                className="w-full h-full pl-12 pr-4 py-3 focus:outline-none"/>
            </div>
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Date Filter */}
            <div className="relative w-full md:w-52">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-full px-4 py-3 focus:outline-none bg-white cursor-pointer"/>
            </div>
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Status Filter */}
            <div className="relative w-full md:w-56">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full h-full px-4 py-3 cursor-pointer">
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filter !== "all" || selectedDate || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
              <span className="text-gray-500">Active filters:</span>

              {searchTerm && (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="text-gray-600 hover:text-black">✕</button>
                </span>
              )}

              {selectedDate && (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                  Date: {selectedDate}
                  <button onClick={() => setSelectedDate("")} className="text-gray-600 hover:text-black">✕</button>
                </span>
              )}

              {filter !== "all" && (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                  Status: {filter}
                  <button onClick={() => setFilter("all")} className="text-gray-600 hover:text-black">✕</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
          <table className="w-full min-w-225 text-left">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b text-gray-600">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Total Amount</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredOrders.map((order) => (
                <tr className="border-b" key={order._id}>
                  <td className="py-3 px-2 font-medium">{order._id.slice(-6)}</td>
                  <td className="py-3 px-2">{order.customer.firstName}</td>
                  <td className="py-3 px-2">₹ {order.total}</td>
                  <td className="py-3 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide
                        ${statusStyles[order.orderStatus] || "bg-gray-200 text-gray-800"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="pl-5">
                      <button onClick={() => { setSelectedOrder(order), setShowModal(true) }} 
                        className="text-blue-800 hover:text-blue-950 text-lg cursor-pointer"><FaEye /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          </div>
        </div>

      </main>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold"> Order Details </h2>
              <button onClick={() => setShowModal(false)} className="text-2xl text-gray-500 hover:text-black cursor-pointer">
                ×
              </button>
            </div>

            {/* Customer */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Customer Details :</h3>
              <p className="text-sm text-gray-700 mb-3">
                Name: {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}<br/>
                Phone: {selectedOrder.customer.phone}<br/>
                Email: {selectedOrder.customer.email}
              </p>
              <hr className="text-black/20" />
            </div>

            {/* Address */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Delivery Address :</h3>
              <p className="text-sm text-gray-700 mb-3">
                {selectedOrder.customer.address.line},<br/>
                {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}<br/>
                {selectedOrder.customer.address.pincode}
              </p>
              <hr className="text-black/20" />
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Ordered Items :</h3>
              {selectedOrder.items.map(item => (
                <div key={item.productId} className="flex gap-4 mb-3">
                  <img src={item.image} className="w-16 h-16 object-contain border rounded"/>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="text-sm mb-1">₹ {item.price}</p>
                  </div>
                </div>
              ))}
              <hr className="text-black/20" />
            </div>

            {/* Payment */}
            <div className="mb-3">
              <h3 className="font-semibold mb-1">Payment Info :</h3>
              <p className="text-sm">Method: {selectedOrder.paymentMethod}</p>
              <p className="text-sm mb-3">Status: {selectedOrder.paymentStatus}</p>
              <hr className="text-black/20" />
            </div>

            {/* Price */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Amount Info :</h3>
              <p className="text-sm">Subtotal: ₹ {selectedOrder.subtotal}</p>
              <p className="text-sm">Tax: ₹ {selectedOrder.tax}</p>
              <p className="text-sm">Shipping: ₹ {selectedOrder.shipping}</p>
              <p className="font-semibold mt-1 mb-3">Total: ₹ {selectedOrder.total}</p>
            </div>

            {/* Status */}
            <div className="mt-4 flex items-center gap-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
                  ${statusStyles[selectedOrder.orderStatus] || "bg-gray-200 text-gray-800"}`}>
                {selectedOrder.orderStatus}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Admin_Orders