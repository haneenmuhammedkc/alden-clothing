import React, { useState, useEffect } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Badge from "../component/Badge"
import { Menu, ShoppingBag, DollarSign, Package, Users } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Dashboard — Alden Clothing Management Dashboard
 * Canvas: #F8FAFC, Surface: #FFFFFF, Primary: #30251F, Secondary: #76675D, Accent: #8B634B
 */
const Admin_Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 })

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        const res = await axiosInstance.get("/api/admin/auth/recent-orders", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setRecentOrders(res.data || [])
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
        const res = await axiosInstance.get("/api/admin/auth/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(res.data || {})
      } catch (error) {
        console.error("Dashboard stats error:", error)
      }
    }
    fetchStats()
  }, [])

  const KPICard = ({ icon: IconComponent, title, value }) => (
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
        <div className="flex items-center justify-between pb-4 border-b border-[#DED4CB]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">OPERATIONAL OVERVIEW</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">ADMIN DASHBOARD</h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-[4px] border border-[#DED4CB] text-[#30251F]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* 4 KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={ShoppingBag} title="TOTAL ORDERS" value={(stats.totalOrders || 0).toLocaleString()} />
          <KPICard icon={DollarSign} title="TOTAL REVENUE" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} />
          <KPICard icon={Package} title="ACTIVE PRODUCTS" value={(stats.totalProducts || 0).toLocaleString()} />
          <KPICard icon={Users} title="TOTAL CUSTOMERS" value={(stats.totalUsers || 0).toLocaleString()} />
        </div>

        {/* Recent Orders Table Panel */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DED4CB] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">RECENT STORE ORDERS</h2>
            <span className="text-[11px] font-semibold text-[#76675D]">Showing latest activity</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const statusVariant = 
                      order.orderStatus === "delivered" ? "success" :
                      order.orderStatus === "pending" ? "warning" :
                      order.orderStatus === "shipped" ? "info" : "default"

                    return (
                      <tr key={order._id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-3 font-semibold text-[#8B634B]">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-3 px-3 font-medium">{order.customer?.firstName} {order.customer?.lastName}</td>
                        <td className="py-3 px-3 font-semibold">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3">
                          <Badge variant={statusVariant}>
                            {(order.orderStatus || "UNKNOWN").toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-[#76675D] italic">No recent orders recorded.</td>
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