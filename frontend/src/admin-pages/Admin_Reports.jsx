import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars, FaCheckCircle, FaEye } from "react-icons/fa"
import axios from "axios"

const Admin_Reports = () => {
  
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
      setFeedbacks(res.data.data)
    } catch (err) {
      console.error("Failed to fetch feedbacks", err)
      alert("Failed to load feedbacks")
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
    <div className="w-full min-h-screen flex bg-gray-100 pl-27.5">
      <Admin_Sidebar />

      <main className="flex-1 px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Customer Feedbacks & Reports</h2>
          <FaBars className="text-2xl md:hidden" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          {loading ? (
            <p className="text-center py-10 text-gray-400">Loading feedbacks...</p>
          ) : (
            <table className="w-full min-w-225 text-left text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th>User</th>
                  <th>Product</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map(fb => (
                  <tr key={fb._id} className="border-b border-black/20 hover:bg-gray-50">
                    {/* User */}
                    <td className="py-3">
                      <p className="font-medium">{fb.user?.firstName || "User"}</p>
                      <p className="text-xs text-gray-400">{fb.user?.email}</p>
                    </td>

                    {/* Product */}
                    <td>
                      <p className="font-medium">{fb.product?.name || "Product"}</p>
                      <p className="text-xs text-gray-400 capitalize">{fb.type}</p>
                    </td>

                    {/* Details */}
                    <td>
                      <p className="text-yellow-500 text-xs"> {"★".repeat(fb.rating || 0)}{"☆".repeat(5 - (fb.rating || 0))} </p>
                      <p className="max-w-62.5 truncate text-gray-600"> {fb.message} </p>
                    </td>

                    {/* Status */}
                    <td >
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fb.status === "pending"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                        }`} >
                        {fb.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="flex gap-3 pt-4.5">
                      <button onClick={() => setSelectedFeedback(fb)} className="text-lg text-blue-600 hover:text-blue-800"
                        title="View" >
                        <FaEye />
                      </button>

                      {fb.status === "pending" && (
                        <button onClick={() => resolveFeedback(fb._id)} className="text-md text-green-600 hover:text-green-800"
                          title="Resolve" >
                          <FaCheckCircle />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {feedbacks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400"> No feedbacks found </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* View Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Feedback Details</h3>

            <div className="space-y-2 text-sm">
              <p><b>User:</b> {selectedFeedback.user?.firstName}</p>
              <p><b>Product:</b> {selectedFeedback.product?.name}</p>
              <p><b>Type:</b> {selectedFeedback.type}</p>
              <p><b>Rating:</b> {selectedFeedback.rating || "-"}</p>
              <p><b>Status:</b> {selectedFeedback.status}</p>
              <p><b>Message:</b></p>
              <p className="text-gray-600 border p-2 rounded">
                {selectedFeedback.message}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              {selectedFeedback.status === "pending" && (
                <button onClick={() => resolveFeedback(selectedFeedback._id)} className="px-4 py-1 bg-green-600 text-white rounded text-sm">
                  Mark Resolved
                </button>
              )}
              <button onClick={() => setSelectedFeedback(null)} className="px-4 py-1 border rounded text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin_Reports