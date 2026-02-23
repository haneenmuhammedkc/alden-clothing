import React, { useEffect, useState } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars, FaPlus, FaEdit } from "react-icons/fa"
import axios from "axios"
import Button from "../component/ui/Button"

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
      const res = await axios.get("http://localhost:4001/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(res.data.data)
    } catch(err){
      console.error(err)
    }
  }

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (editMode) {
        await axios.put(
          `http://localhost:4001/api/admin/categories/${selectedId}`,
          newCategory,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          "http://localhost:4001/api/admin/categories/add",
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
    <div className="w-full min-h-screen flex bg-gray-100 pl-[110px]">
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>
      <main className="flex-1 px-6 md:px-10 py-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Product Categories</h2>
          <div className="flex items-center gap-4">
            <Button className="flex items-center gap-2 px-5" onClick={() => {
                setEditMode(false)
                setNewCategory({ name: "", description: "" })
                setShowModal(true)
              }}>
              <FaPlus /> Add Category
            </Button>
            <FaBars onClick={() => setMobileMenuOpen(true)} className="text-2xl text-gray-700 cursor-pointer md:hidden"/>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-black/20 text-gray-700 text-sm">
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Edit</th>
              </tr>
            </thead>

            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b border-black/20 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{cat.name}</td>
                  <td className="py-4 px-6">{cat.description}</td>
                  <td className="py-4 px-6">{cat.status}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => handleEditClick(cat)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400"> No categories found </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] md:w-[400px] mx-auto mt-24">
            <h3 className="text-lg font-semibold mb-4"> {editMode ? "Edit Category" : "Add Category"} </h3>

            {/* Category Name */}
            <input type="text" placeholder="Category Name" value={newCategory.name}
              className="w-full px-4 py-3 border rounded-lg mb-3"
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value }) }/>

            {/* Category Description */}
            <textarea placeholder="Description" value={newCategory.description}
              className="w-full px-4 py-3 border rounded-lg mb-4"
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value }) }/>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>

              <button onClick={handleAddCategory} className="px-5 py-2 bg-black text-white rounded-lg">
                {editMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin_Category