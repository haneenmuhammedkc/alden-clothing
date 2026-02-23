import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import {
  FaBars,
  FaEye,
  FaTrash,
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaShoppingCart
} from "react-icons/fa"
import axios from "axios"

const Admin_Customers = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:4001/api/admin/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      })
      setCustomers(res.data.customers)
    } catch (error) {
      console.error("Failed to fetch customers", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:4001/api/admin/customers/${id}/status`,
        {
          status: currentStatus === "Active" ? "Blocked" : "Active"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      )
      fetchCustomers()
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  const filteredCustomers = customers
    .filter(c =>
      filter === "all" ? true : c.status === filter
    )
    .filter(c =>
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase())
    )

  const Card = ({ title, value, subText, iconBg, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="text-gray-400 text-xs">{subText}</p>
      </div>
    </div>
  )

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-100 pl-[110px]">

      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
          <FaBars onClick={() => setMobileMenuOpen(true)} className="text-2xl text-gray-600 cursor-pointer md:hidden" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card title="Total Customers" value={customers.length} subText="Registered users" iconBg="bg-blue-500" icon={<FaUsers />} />
          <Card title="Active Customers" value={customers.filter(c => c.status === "Active").length} subText="Currently active" iconBg="bg-green-500" icon={<FaUserCheck />} />
          <Card title="Blocked Customers" value={customers.filter(c => c.status === "Blocked").length} subText="Restricted accounts" iconBg="bg-red-500" icon={<FaUserSlash />} />
          <Card title="Customers with Orders" value={customers.filter(c => (c.ordersCount || 0) > 0).length} subText="Paying customers" iconBg="bg-yellow-500" icon={<FaShoppingCart />} />
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input type="text" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none bg-white"/>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl p-4 overflow-x-auto">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No customers found.</p>
          ) : (
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Phone</th>
                  <th className="py-3 px-2">Orders</th>
                  <th className="py-3 px-2">Joined</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredCustomers.map(customer => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{customer.name}</td>
                    <td className="py-3 px-2">{customer.email}</td>
                    <td className="py-3 px-2">{customer.phone || "-"}</td>
                    <td className="py-3 px-2">{customer.ordersCount || 0}</td>
                    <td className="py-3 px-2">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-4 pl-6">
                        <button onClick={() => toggleStatus(customer._id, customer.status)} className="text-yellow-600 hover:text-yellow-900"
                          title={customer.status === "Active" ? "Block User" : "Unblock User"}>
                          {customer.status === "Active" ? <FaUserSlash /> : <FaUserCheck />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  )
}

export default Admin_Customers