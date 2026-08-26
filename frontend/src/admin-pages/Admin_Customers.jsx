import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Badge from "../component/Badge"
import { Menu, Users, UserCheck, UserX, Search, ShieldAlert, ShieldCheck } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Customers — Alden Clothing Customer Directory Workspace
 */
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
      const res = await axiosInstance.get("/api/admin/customers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      })
      setCustomers(res.data.customers || [])
    } catch (error) {
      console.error("Failed to fetch customers", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.patch(
        `/api/admin/customers/${id}/status`,
        { status: currentStatus === "Active" ? "Blocked" : "Active" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      )
      fetchCustomers()
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  const filteredCustomers = customers
    .filter(c => filter === "all" ? true : c.status === filter)
    .filter(c =>
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase())
    )

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
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">DIRECTORY CONTROL</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">CUSTOMER MANAGEMENT</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="TOTAL CUSTOMERS" value={customers.length} icon={Users} />
          <KPICard title="ACTIVE ACCOUNTS" value={customers.filter(c => c.status === "Active").length} icon={UserCheck} />
          <KPICard title="BLOCKED ACCOUNTS" value={customers.filter(c => c.status === "Blocked").length} icon={UserX} />
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#76675D]" />
            <input
              type="text"
              placeholder="Search customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs uppercase text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {["all", "Active", "Blocked"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-bold uppercase transition-colors cursor-pointer ${
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

        {/* Customer Directory Table */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-[#76675D] italic">Loading directory...</td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-semibold text-[#30251F]">{cust.name || "Anonymous Client"}</td>
                      <td className="py-3 px-3 text-[#76675D]">{cust.email}</td>
                      <td className="py-3 px-3 text-[#76675D]">{cust.phone || "—"}</td>
                      <td className="py-3 px-3">
                        <Badge variant={cust.status === "Active" ? "success" : "danger"}>
                          {(cust.status || "ACTIVE").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleStatus(cust._id, cust.status)}
                          className={`px-3 py-1 text-xs font-semibold rounded-[4px] transition-colors cursor-pointer ${
                            cust.status === "Active"
                              ? "border border-[#8C2727] text-[#8C2727] hover:bg-[#8C2727] hover:text-white"
                              : "border border-[#2D5A27] text-[#2D5A27] hover:bg-[#2D5A27] hover:text-white"
                          }`}
                        >
                          {cust.status === "Active" ? "BLOCK ACCESS" : "UNBLOCK ACCESS"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-[#76675D] italic">No customers found matching filter.</td>
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

export default Admin_Customers