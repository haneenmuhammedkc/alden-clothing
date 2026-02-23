import React, { useEffect, useState } from "react"
import axios from "axios"
import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars, FaRupeeSign, FaShoppingCart, FaChartLine } from "react-icons/fa"

const Admin_Sales = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [salesReport, setSalesReport] = useState([])
  const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 })
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Fetch Sales Report
  const fetchSalesReport = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get(
        "http://localhost:4001/api/orders/sales-report",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { fromDate, toDate }
        }
      )
      setSalesReport(res.data.report)
      setSummary(res.data.summary)
    } catch(error){
      console.error("Sales report error:", error)
    }
  }
  useEffect(() => {
    fetchSalesReport()
  }, [])

  // Card Components
  const Card = ({ icon: Icon, title, value, iconColor }) => (
    <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-5">
      <Icon className={`text-4xl ${iconColor}`} />
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
    </div>
  )

  return (
    <div className="w-full h-screen flex bg-gray-100 overflow-hidden">
      <Admin_Sidebar />

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 overflow-y-auto ml-27.5">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800"> Sales Report </h2>
          <FaBars onClick={() => setMobileMenuOpen(true)} className="text-2xl text-gray-600 cursor-pointer md:hidden"/>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card icon={FaRupeeSign} iconColor="text-green-500" title="Total Revenue"
            value={`₹${summary.totalRevenue.toLocaleString()}`}/>
          <Card icon={FaShoppingCart} iconColor="text-blue-500" title="Total Orders"
            value={summary.totalOrders}/>
          <Card icon={FaChartLine} iconColor="text-purple-500" title="Avg Order Value"
            value={`₹${summary.avgOrderValue.toLocaleString()}`}/>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm text-gray-500">From</label>
            <input type="date" className="border rounded-md px-3 py-2 block" value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}/>
          </div>

          <div>
            <label className="text-sm text-gray-500">To</label>
            <input type="date" className="border rounded-md px-3 py-2 block" value={toDate}
              onChange={(e) => setToDate(e.target.value)}/>
          </div>

          <button onClick={fetchSalesReport} className="bg-black text-white px-5 py-2 rounded-md">
            Apply Filter
          </button>
        </div>

        {/* Sales Table */}
        <div className="bg-white p-6 shadow-md rounded-xl">
          <h3 className="text-xl font-semibold mb-5">Detailed Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3">Date</th>
                  <th className="py-3">Orders</th>
                  <th className="py-3">Total Sales</th>
                </tr>
              </thead>

              <tbody>
                {salesReport.length > 0 ? (
                  salesReport.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3"> {item.date} </td>
                      <td className="py-3"> {item.orders} </td>
                      <td className="py-3 font-semibold text-green-600"> ₹{item.totalSales.toLocaleString()} </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-400"> No sales data </td>
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