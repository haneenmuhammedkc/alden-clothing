import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Button from "../component/Button"
import Input from "../component/Input"
import Select from "../component/Select"
import Badge from "../component/Badge"
import { Menu, Tag, ToggleLeft, ToggleRight } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Promos — Alden Clothing Promotional Voucher Management Workspace
 */
const AdminPromos = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minCartValue: "",
    maxDiscount: "",
    usageLimit: "",
    expiryDate: ""
  })

  const token = localStorage.getItem("adminToken")

  const fetchPromos = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axiosInstance.get("/api/admin/promos", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPromos(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError("Failed to load promos")
      setPromos([])
    } finally {
      setLoading(false)
    }
  }

  const createPromo = async () => {
    try {
      await axiosInstance.post("/api/admin/promos", form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setForm({ code: "", discountType: "percent", discountValue: "", minCartValue: "", maxDiscount: "", usageLimit: "", expiryDate: "" })
      fetchPromos()
    } catch (err) {
      console.error(err)
      alert("Failed to create promo")
    }
  }

  const togglePromo = async (id) => {
    try {
      await axiosInstance.patch(`/api/admin/promos/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPromos()
    } catch (err) {
      console.error(err)
      alert("Toggle failed")
    }
  }

  useEffect(() => {
    fetchPromos()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#30251F] font-sans md:pl-60 flex flex-col selection:bg-[#8B634B] selection:text-white">
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DED4CB]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">PROMOTIONAL CONTROL</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">PROMO CODES & VOUCHERS</h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-[4px] border border-[#DED4CB] text-[#30251F]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Create Promo Panel */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
            CREATE PROMO DISCOUNTS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              label="Promo Code"
              placeholder="e.g. ALDEN10"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />

            <Select
              label="Discount Type"
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              options={[
                { value: "percent", label: "PERCENTAGE (%)" },
                { value: "flat", label: "FLAT AMOUNT (₹)" }
              ]}
            />

            <Input
              label="Discount Value"
              type="number"
              placeholder="e.g. 10"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            />

            <Input
              label="Min Cart Value (₹)"
              type="number"
              placeholder="e.g. 2000"
              value={form.minCartValue}
              onChange={(e) => setForm({ ...form, minCartValue: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={createPromo} className="text-xs">
              CREATE PROMO VOUCHER
            </Button>
          </div>
        </div>

        {/* Promos Data Table Panel */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
            ACTIVE PROMOTIONAL CODES
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Promo Code</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Discount</th>
                  <th className="py-2.5 px-3">Min Cart</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-[#76675D] italic">Loading promos...</td>
                  </tr>
                ) : promos.length > 0 ? (
                  promos.map((p) => (
                    <tr key={p._id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-semibold text-[#8B634B] uppercase">{p.code}</td>
                      <td className="py-3 px-3 uppercase text-[#76675D]">{p.discountType}</td>
                      <td className="py-3 px-3 font-semibold">{p.discountType === 'percent' ? `${p.discountValue}%` : `₹${p.discountValue}`}</td>
                      <td className="py-3 px-3 text-[#76675D]">₹{(p.minCartValue || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3">
                        <Badge variant={p.isActive ? "success" : "danger"}>
                          {p.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => togglePromo(p._id)}
                          className="p-1.5 text-[#8B634B] hover:bg-[#F5EFE8] rounded-[4px] cursor-pointer"
                        >
                          {p.isActive ? <ToggleRight className="w-5 h-5 text-[#2D5A27]" /> : <ToggleLeft className="w-5 h-5 text-[#76675D]" />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-[#76675D] italic">No promotional codes found.</td>
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

export default AdminPromos