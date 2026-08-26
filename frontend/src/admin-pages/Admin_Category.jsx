import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Button from "../component/Button"
import Input from "../component/Input"
import Modal from "../component/Modal"
import Badge from "../component/Badge"
import { Menu, Plus, Edit } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Category — Alden Clothing Category Management Workspace
 */
const Admin_Category = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axiosInstance.get("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (editMode) {
        await axiosInstance.put(
          `/api/admin/categories/${selectedId}`,
          newCategory,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axiosInstance.post(
          "/api/admin/categories/add",
          newCategory,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      fetchCategories()
      setShowModal(false)
      setEditMode(false)
      setSelectedId(null)
      setNewCategory({ name: "", description: "" })
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save category")
    }
  }

  const handleEditClick = (cat) => {
    setEditMode(true)
    setSelectedId(cat._id)
    setNewCategory({
      name: cat.name,
      description: cat.description
    })
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#30251F] font-sans md:pl-60 flex flex-col selection:bg-[#8B634B] selection:text-white">
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DED4CB]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">TAXONOMY CONTROL</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">CATEGORY MANAGEMENT</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={() => {
                setEditMode(false)
                setNewCategory({ name: "", description: "" })
                setShowModal(true)
              }}
              className="text-xs"
            >
              <span className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>CREATE NEW CATEGORY</span>
              </span>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-[4px] border border-[#DED4CB] text-[#30251F]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Data Table Panel */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Category Name</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-semibold text-[#8B634B] uppercase">{cat.name}</td>
                      <td className="py-3 px-3 text-[#76675D]">{cat.description || "No description provided"}</td>
                      <td className="py-3 px-3">
                        <Badge variant="success">ACTIVE</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditClick(cat)}
                          className="p-1.5 text-[#8B634B] hover:bg-[#F5EFE8] rounded-[4px] cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-[#76675D] italic">No categories defined yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editMode ? "EDIT CATEGORY DETAILS" : "CREATE NEW CATEGORY"}
      >
        <div className="space-y-4 font-sans">
          <Input
            label="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Input
            label="Category Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <div className="pt-3 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>CANCEL</Button>
            <Button variant="primary" onClick={handleAddCategory}>
              {editMode ? "UPDATE CATEGORY" : "SAVE CATEGORY"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Admin_Category