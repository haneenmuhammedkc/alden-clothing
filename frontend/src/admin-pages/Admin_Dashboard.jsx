import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars, FaBox, FaShoppingCart, FaUsers, FaRupeeSign } from "react-icons/fa"
import axios from "axios"
import React, { useState, useEffect } from "react"

const Admin_Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])
  const [salesReport, setSalesReport] = useState([])
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 })

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        const res = await axios.get(
          "http://localhost:4001/api/admin/auth/recent-orders",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setRecentOrders(res.data)
      } catch (error) {
        console.error("Recent orders error:", error)
      }
    }
    fetchRecentOrders()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        const res = await axios.get("http://localhost:4001/api/admin/auth/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setStats(res.data)
      } catch (error) {
        console.error("Dashboard stats error:", error)
      }
    }
    fetchStats()
  }, [])

  const Card = ({ icon: Icon, title, value, iconColor }) => {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-5">
        <Icon className={`text-4xl ${iconColor}`} />
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-gray-100 pl-27.5 overflow-hidden">

      {/* Sidebar */}
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 overflow-hidden flex flex-col">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800"> Dashboard </h2>
          <FaBars onClick={() => setMobileMenuOpen(true)} className="text-2xl text-gray-600 cursor-pointer md:hidden" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card icon={FaShoppingCart} iconColor="text-blue-500" title="Total Orders" value={stats.totalOrders}/>
          <Card icon={FaRupeeSign} iconColor="text-green-500" title="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`}/>
          <Card icon={FaBox} iconColor="text-orange-500" title="Active Products" value={stats.totalProducts} />
          <Card icon={FaUsers} iconColor="text-purple-500" title="Users" value={stats.totalUsers}/>
        </div>

        {/* Recent Order's Table */}
        <div className="bg-white p-6 shadow-md rounded-xl flex-1 flex flex-col overflow-hidden">
          <h3 className="text-xl font-semibold mb-5">Recent Orders</h3>
          
          <div className="flex-1 overflow-y-auto">
          <table className="w-full min-w-125 text-left">
            <thead className="sticky top-0 bg-white z-10 border-b text-gray-500">
              <tr className="border-b text-gray-500">
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3"> #{order._id.slice(-6)} </td>
                  <td className="py-3"> {order.customer.firstName} {order.customer.lastName} </td>
                  <td className="py-3"> ₹{order.total} </td>
                  <td className={`py-3 font-semibold ${
                    order.orderStatus === "delivered"
                      ? "text-green-600"
                      : order.orderStatus === "pending"
                      ? "text-yellow-500"
                      : order.orderStatus === "shipped"
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}>
                    {order.orderStatus}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-400"> No recent orders </td>
              </tr>
            )}
          </tbody>
          </table>
          </div>
        </div>

      </main>
    </div>
    
  )
}

export default Admin_Dashboard