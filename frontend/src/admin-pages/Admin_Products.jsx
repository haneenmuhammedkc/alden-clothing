import React, { useState, useEffect } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import Button from "../component/Button"
import Input from "../component/Input"
import Select from "../component/Select"
import Badge from "../component/Badge"
import Modal from "../component/Modal"
import { Menu, Plus, Eye, Trash2, RotateCcw, Search, Image as ImageIcon } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

/**
 * Admin_Products — Alden Clothing Product Management Workspace
 */
const Admin_Products = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [productData, setProductData] = useState({
    name: "",
    productId: "",
    category: "",
    collectionName: "",
    color: "",
    sizes: [],
    price: "",
    description: "",
    stockQty: "",
    stockStatus: "",
    status: "",
    images: []
  })
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState("all")
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImages, setSelectedImages] = useState([])
  const [categories, setCategories] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (filter === "deleted") {
      fetchDeletedProducts()
    } else {
      fetchProducts()
    }
  }, [filter])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axiosInstance.get("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(res.data.data || [])
    } catch (err) {
      console.error("Categories fetch error:", err)
    }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axiosInstance.get("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(res.data.data || [])
    } catch (error) {
      console.error("Fetch Error:", error)
    }
  }

  const fetchDeletedProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axiosInstance.get("/api/admin/products/deleted", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(res.data.data || [])
    } catch (error) {
      console.error("Fetch Deleted Error:", error)
    }
  }

  const uploadImagesToCloudinary = async (files) => {
    const urls = []
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET
    for (let file of files) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", PRESET)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed")
      }
      urls.push(data.secure_url)
    }
    return urls
  }

  const handleSaveProduct = async () => {
    try {
      setIsAdding(true)
      const token = localStorage.getItem("adminToken")
      let imageUrls = productData.images || []

      if (selectedImages.length > 0) {
        const uploaded = await uploadImagesToCloudinary(selectedImages)
        imageUrls = [...imageUrls, ...uploaded]
      }

      const payload = { ...productData, images: imageUrls }

      if (isEditing && selectedProduct) {
        await axiosInstance.put(
          `/api/admin/products/${selectedProduct._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axiosInstance.post(
          "/api/admin/products/add",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      setShowModal(false)
      setSelectedImages([])
      fetchProducts()
    } catch (err) {
      alert("Failed to save product")
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      const token = localStorage.getItem("adminToken")
      await axiosInstance.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProducts()
    } catch (err) {
      alert("Failed to delete product")
    }
  }

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      await axiosInstance.put(
        `/api/admin/products/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchDeletedProducts()
    } catch (err) {
      alert("Failed to restore product")
    }
  }

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.productId?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" ||
      item.category?._id === selectedCategory ||
      item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#30251F] font-sans md:pl-60 flex flex-col selection:bg-[#8B634B] selection:text-white">
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DED4CB]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B634B]">CATALOG CONTROL</span>
            <h1 className="text-2xl font-bold text-[#30251F] tracking-tight uppercase">PRODUCT MANAGEMENT</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={() => {
                setIsEditing(false)
                setProductData({
                  name: "", productId: "", category: "", collectionName: "", color: "",
                  sizes: [], price: "", description: "", stockQty: "", stockStatus: "In Stock", status: "Active", images: []
                })
                setSelectedImages([])
                setShowModal(true)
              }}
              className="text-xs"
            >
              <span className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>ADD NEW PRODUCT</span>
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

        {/* Filter Controls Bar */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#76675D]" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs uppercase text-[#30251F] focus:outline-none focus:border-[#8B634B]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-[#F8FAFC] border border-[#DED4CB] rounded-[4px] text-xs font-semibold text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            >
              <option value="all">ALL CATEGORIES</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name?.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {["all", "Active", "Draft", "deleted"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-bold uppercase transition-colors cursor-pointer ${
                  filter === tab
                    ? "bg-[#8B634B] text-white"
                    : "bg-[#F8FAFC] border border-[#DED4CB] text-[#76675D] hover:text-[#30251F]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#FFFFFF] border border-[#DED4CB] rounded-[8px] p-6 space-y-4 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED4CB] text-[#76675D] font-bold uppercase">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">ID / SKU</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED4CB]/60 text-[#30251F]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.images?.[0] || "https://via.placeholder.com/40"}
                            alt={prod.name}
                            className="w-9 h-11 object-cover rounded-[4px] bg-[#F5EFE8] border border-[#DED4CB]/60"
                          />
                          <span className="font-semibold text-[#30251F]">{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#76675D]">{prod.productId || prod._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-3 font-medium uppercase">{prod.category?.name || "Unassigned"}</td>
                      <td className="py-3 px-3 font-semibold">₹{(prod.price || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-medium">{prod.stockQty || 0} pcs</td>
                      <td className="py-3 px-3">
                        <Badge variant={prod.stockStatus === "In Stock" ? "success" : "danger"}>
                          {(prod.stockStatus || "ACTIVE").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {filter === "deleted" ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(prod._id)}
                              className="p-1.5 text-[#2D5A27] hover:bg-[#E8F2E6] rounded-[4px] cursor-pointer"
                              title="Restore Product"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProduct(prod)
                                  setIsEditing(true)
                                  setProductData({
                                    name: prod.name || "",
                                    productId: prod.productId || "",
                                    category: prod.category?._id || prod.category || "",
                                    collectionName: prod.collectionName || "",
                                    color: prod.color || "",
                                    sizes: prod.sizes || [],
                                    price: prod.price || "",
                                    description: prod.description || "",
                                    stockQty: prod.stockQty || "",
                                    stockStatus: prod.stockStatus || "In Stock",
                                    status: prod.status || "Active",
                                    images: prod.images || []
                                  })
                                  setShowModal(true)
                                }}
                                className="p-1.5 text-[#8B634B] hover:bg-[#F5EFE8] rounded-[4px] cursor-pointer"
                                title="Edit Product"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSoftDelete(prod._id)}
                                className="p-1.5 text-[#8C2727] hover:bg-[#8C2727]/10 rounded-[4px] cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-[#76675D] italic">No products found matching selection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? "EDIT PRODUCT CATALOG ITEM" : "ADD NEW PRODUCT TO CATALOG"}
      >
        <div className="space-y-4 font-sans max-h-[75vh] overflow-y-auto pr-1">
          <Input
            label="Product Title"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU / Product ID"
              value={productData.productId}
              onChange={(e) => setProductData({ ...productData, productId: e.target.value })}
            />
            <Select
              label="Category"
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              options={categories.map(c => ({ value: c._id, label: c.name.toUpperCase() }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (₹)"
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              type="number"
              value={productData.stockQty}
              onChange={(e) => setProductData({ ...productData, stockQty: e.target.value })}
            />
          </div>
          <Input
            label="Color / Tone"
            value={productData.color}
            onChange={(e) => setProductData({ ...productData, color: e.target.value })}
          />
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#30251F]">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedImages(Array.from(e.target.files))}
              className="w-full text-xs text-[#76675D] file:mr-4 file:py-2 file:px-4 file:rounded-[4px] file:border-0 file:text-xs file:font-semibold file:bg-[#8B634B] file:text-white"
            />
          </div>
          <div className="pt-3 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>CANCEL</Button>
            <Button variant="primary" disabled={isAdding} onClick={handleSaveProduct}>
              {isAdding ? "SAVING..." : "SAVE PRODUCT"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Admin_Products