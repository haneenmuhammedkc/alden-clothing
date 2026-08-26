import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Button from "../component/Button"
import Input from "../component/Input"
import { Menu, DollarSign, ShoppingBag, TrendingUp, Calendar } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Sales — Alden Clothing Sales Report Workspace
 */
const Admin_Sales = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [salesReport, setSalesReport] = useState([])
  const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 })
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const fetchSalesReport = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axiosInstance.get("/api/orders/sales-report", {
        headers: { Authorization: `Bearer ${token}` },
        params: { fromDate, toDate }
      })
      setSalesReport(res.data.report || [])
      setSummary(res.data.summary || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 })
    } catch (error) {
      console.error("Sales report error:", error)
    }
  }

  useEffect(() => {
    fetchSalesReport()
  }, [])

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
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">FINANCIAL REVENUE REPORT</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">SALES REPORT</h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-[4px] border border-[#DED4CB] text-[#30251F]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* 3 KPI Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="TOTAL REVENUE" value={`₹${(summary.totalRevenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} />
          <KPICard title="TOTAL ORDERS" value={(summary.totalOrders || 0).toLocaleString()} icon={ShoppingBag} />
          <KPICard title="AVG ORDER VALUE" value={`₹${(summary.avgOrderValue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
        </div>

        {/* Date Filter Bar */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-4 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 shadow-2xs">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-[#76675D] uppercase">FROM:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="py-1.5 px-3 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-[#76675D] uppercase">TO:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="py-1.5 px-3 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            />
          </div>

          <Button variant="primary" onClick={fetchSalesReport} className="text-xs">
            APPLY FILTER
          </Button>
        </div>

        {/* Detailed Sales Data Table */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
            ITEMIZED SALES REPORT
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Orders Count</th>
                  <th className="py-2.5 px-3 text-right">Total Revenue Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {salesReport.length > 0 ? (
                  salesReport.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-semibold text-[#30251F]">{row._id}</td>
                      <td className="py-3 px-3 font-medium text-[#76675D]">{row.count || row.orders} orders</td>
                      <td className="py-3 px-3 font-bold text-right text-[#8B634B]">₹{(row.totalSales || row.sales || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-[#76675D] italic">No sales records for selected range.</td>
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

export default Admin_Sales