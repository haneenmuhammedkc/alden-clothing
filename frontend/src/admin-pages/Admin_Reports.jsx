import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Badge from "../component/Badge"
import Button from "../component/Button"
import Modal from "../component/Modal"
import { Menu, CheckCircle, Eye } from "lucide-react"
import axios from "axios"

/**
 * Admin_Reports — Alden Clothing Customer Feedback Moderation Workspace
 */
const Admin_Reports = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get(`${API}/api/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFeedbacks(res.data.data || [])
    } catch (err) {
      console.error("Failed to fetch feedbacks", err)
    } finally {
      setLoading(false)
    }
  }

  const resolveFeedback = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      await axios.put(`${API}/api/admin/feedback/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFeedbacks()
      setSelectedFeedback(null)
    } catch (err) {
      alert("Failed to resolve feedback")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#30251F] font-sans md:pl-60 flex flex-col selection:bg-[#8B634B] selection:text-white">
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DED4CB]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">MODERATION & REVIEWS</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">FEEDBACK & REPORTS</h1>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-[4px] border border-[#DED4CB] text-[#30251F]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Data Table Panel */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Rating & Message</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-[#76675D] italic">Loading feedback reports...</td>
                  </tr>
                ) : feedbacks.length > 0 ? (
                  feedbacks.map((fb) => (
                    <tr key={fb._id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-semibold text-[#30251F]">
                        {fb.user?.firstName || "Verified User"}
                        <span className="block text-[11px] text-[#76675D] font-normal">{fb.user?.email}</span>
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {fb.product?.name || "Product Catalog Item"}
                        <span className="block text-[11px] text-[#76675D] uppercase">{fb.type}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[#8B634B] font-bold text-xs pb-0.5">
                          {"★".repeat(fb.rating || 0)}{"☆".repeat(5 - (fb.rating || 0))}
                        </div>
                        <p className="text-[#76675D] max-w-xs truncate">{fb.message}</p>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={fb.status === "pending" ? "warning" : "success"}>
                          {(fb.status || "PENDING").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedFeedback(fb)}
                            className="p-1.5 text-[#8B634B] hover:bg-[#F5EFE8] rounded-[4px] cursor-pointer"
                            title="View Feedback Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {fb.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => resolveFeedback(fb._id)}
                              className="p-1.5 text-[#2D5A27] hover:bg-[#E8F2E6] rounded-[4px] cursor-pointer"
                              title="Resolve Feedback"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-[#76675D] italic">No feedback submissions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* View Feedback Modal */}
      <Modal
        isOpen={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        title="FEEDBACK REPORT DETAIL"
      >
        {selectedFeedback && (
          <div className="space-y-3 font-sans text-xs">
            <div className="bg-[#F5EFE8] p-3 rounded-[6px] border border-[#DED4CB] space-y-1">
              <p className="font-bold text-[#30251F]">{selectedFeedback.user?.firstName} ({selectedFeedback.user?.email})</p>
              <p className="text-[#76675D]">TARGET PRODUCT: {selectedFeedback.product?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold uppercase text-[#30251F]">RATING & SUBMISSION</p>
              <p className="text-[#8B634B] font-bold">{"★".repeat(selectedFeedback.rating || 0)}</p>
              <p className="text-[#76675D] leading-relaxed">"{selectedFeedback.message}"</p>
            </div>
            <div className="pt-3 flex justify-end space-x-2">
              {selectedFeedback.status === "pending" && (
                <Button variant="primary" onClick={() => resolveFeedback(selectedFeedback._id)}>
                  MARK AS RESOLVED
                </Button>
              )}
              <Button variant="secondary" onClick={() => setSelectedFeedback(null)}>DISMISS</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Admin_Reports