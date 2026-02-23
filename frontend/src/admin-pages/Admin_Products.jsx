import React, { useState, useEffect } from "react"
import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars, FaPlus, FaEye, FaTrash } from "react-icons/fa"
import { assets } from "../assets/assets"
import axios from "axios"
import Button from "../component/ui/Button"
import Loader from "../component/ui/Loader"

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
    images: [],
  })
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState("all")
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImages, setSelectedImages] = useState([])
  const [editingImageIndex, setEditingImageIndex] = useState(null)
  const [categories, setCategories] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (filter === "deleted") {
      fetchDeletedProducts()
    } else {
      fetchProducts()
    }
  }, [filter])

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setIsEditing(false)
    setShowViewModal(true)
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
        { method: "POST", body: formData },
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed")
      }
      urls.push(data.secure_url)
    }
    return urls
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken") // 👈 get JWT
      const res = await axios.get("http://localhost:4001/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 SEND JWT
        },
      })
      setProducts(res.data.data || [])
    } catch (error) {
      console.error("Fetch Error:", error)
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

    let matchesStatus = true
    if (filter === "Active") {
      matchesStatus = !item.isDeleted
    } else if (filter === "Disabled") {
      matchesStatus = item.isDeleted
    } else if (
      filter === "In Stock" ||
      filter === "Low Stock" ||
      filter === "Out of Stock"
    ) {
      matchesStatus = item.stockStatus === filter
    }
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalProducts = products.length
  const activeProducts = products.filter((p) => !p.isDeleted).length
  const lowStockProducts = products.filter(
    (p) => !p.isDeleted && p.stockStatus === "Low Stock",
  ).length
  const outOfStockProducts = products.filter(
    (p) => !p.isDeleted && p.stockStatus === "Out of Stock",
  ).length

  const fetchDeletedProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get(
        "http://localhost:4001/api/admin/products/deleted",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setProducts(res.data.data || [])
    } catch (error) {
      console.error("Fetch Error:", error)
      setProducts([]) // fallback safety
    }
  }

  const handleSoftDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      await axios.put(
        `http://localhost:4001/api/admin/products/soft-delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      fetchProducts() // refresh table after delete
    } catch (err) {
      console.error("Soft delete failed:", err)
    }
  }

  const handleAddProduct = async () => {
    try {
      setIsAdding(true)

      const token = localStorage.getItem("adminToken")
      const imageUrls = await uploadImagesToCloudinary(selectedImages)

      await axios.post(
        "http://localhost:4001/api/admin/products/add",
        { ...productData, images: imageUrls },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      alert("Product added successfully")
      fetchProducts()
      setShowModal(false)

    } catch (error) {
      console.error(error)
      alert(error.message || "Failed to add product")
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const updatedData = {
        name: selectedProduct.name,
        category: selectedProduct.category._id,
        collectionName: selectedProduct.collectionName,
        color: selectedProduct.color,
        sizes: selectedProduct.sizes,
        price: selectedProduct.price,
        stockQty: selectedProduct.stockQty,
        stockStatus: selectedProduct.stockStatus,
        status: selectedProduct.status,
        images: selectedProduct.images,
      }

      await axios.put(
        `http://localhost:4001/api/admin/products/update/${selectedProduct._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      alert("Product updated successfully")
      fetchProducts()
      setShowViewModal(false)
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message)
      alert("Update failed")
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get(
        "http://localhost:4001/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setCategories(res.data.data)
    } catch (err) {
      console.error("Failed to fetch categories", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      await axios.put(
        `http://localhost:4001/api/admin/products/restore/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProducts()
    } catch (error) {
      console.error("Restore failed:", error)
    }
  }

  const moveImage = (from, to) => {
    if (to < 0 || to >= selectedProduct.images.length) return

    const updated = [...selectedProduct.images]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)

    setSelectedProduct({ ...selectedProduct, images: updated })
  }

  const getStockStatus = (qty) => {
    if (qty === 0) return "Out of Stock"
    if (qty < 10) return "Low Stock"
    return "In Stock"
  }

  const getCategoryName = (id) => {
    const cat = categories.find(c => c._id === id)
    return cat ? cat.name : id
  }

  const Card = ({ title, value, subText }) => {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-gray-500 text-md font-semibold">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
          <p className="text-gray-400 text-sm">{subText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-gray-100 pl-27.5 overflow-hidden">

      {/* GLOBAL LOADING OVERLAY */}
      {isAdding && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      {/* Sidebar */}
      <Admin_Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 overflow-hidden flex flex-col">

        {/* Header + Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Manage Products</h2>
          <div className="flex items-center pt-3 gap-4">
            <Button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5" >
              <FaPlus />
              Add Product
            </Button>
            <FaBars onClick={() => setMobileMenuOpen(true)} className="text-2xl text-gray-600 cursor-pointer md:hidden"/>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card title="Total Products" value={totalProducts} subText="All Inventory Items"/>
          <Card title="Active Products" value={activeProducts} subText="Currently Selling"/>
          <Card title="Low-Stock Products" value={lowStockProducts} subText="Less Than 10 items"/>
          <Card title="Out-of-Stock Products" value={outOfStockProducts} subText="Need Restocking"/>
        </div>

        {/* Search, Category, Status */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row items-stretch bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
            
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <img src={assets.search_icon} className="w-5" />
              </span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or category" className="w-full h-full pl-12 pr-4 py-3 focus:outline-none"/>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Category Filter */}
            <div className="relative w-full md:w-48">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-full px-4 py-3 appearance-none focus:outline-none bg-white">
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}> {" "} {cat.name}{" "} </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Status Filter */}
            <div className="relative w-full md:w-56">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="w-full h-full px-4 py-3 appearance-none focus:outline-none bg-white">
                <option value="all">All Products</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </span>

            </div>
          </div>

          {/* Active Filters Indicator */}
          {(selectedCategory !== "all" || filter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
              <span className="text-gray-500">Active filters:</span>

              {selectedCategory !== "all" && (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                  Category: {getCategoryName(selectedCategory)}
                  <button onClick={() => setSelectedCategory("all")} className="text-gray-600 hover:text-black">
                    {" "}
                    ✕{" "}
                  </button>
                </span>
              )}

              {filter !== "all" && (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                  Status: {filter === "deleted" ? "Disabled" : filter}
                  <button onClick={() => setFilter("all")} className="text-gray-600 hover:text-black">
                    {" "}
                    ✕{" "}
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-200 text-left">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-400 text-gray-600">
                <th className="py-3 px-2">Image</th>
                <th className="py-3 px-2">Product Name</th>
                <th className="py-3 px-2">Product Id</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Stock Quantity</th>
                <th className="py-3 px-2">Stock Status</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredProducts.map((item) => (
                <tr className="border-b border-gray-400" key={item._id}>
                  <td className="py-3 px-2"><img src={item.images?.[0]} className="w-14 h-14 object-cover rounded-md"/></td>
                  <td className="py-3 px-2 font-medium">{item.name}</td>
                  <td className="py-3 px-2">{item.productId}</td>
                  <td className="py-3 px-2">{item.category?.name}</td>
                  <td className="py-3 px-2">₹ {item.price}</td>
                  <td className="py-3 px-2">{item.stockQty} pcs</td>
                  <td className="py-3 px-2 font-medium">{item.stockStatus}</td>
                  <td className={`py-3 px-2 font-medium ${item.isDeleted ? "text-red-600" : "text-green-600"}`}>
                    {item.isDeleted ? "Disabled" : "Active"}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      {/* View Button */}
                      <button onClick={() => handleViewProduct(item)} className="text-blue-900 hover:text-blue-950 text-xl">
                        <FaEye />
                      </button>

                      {/* Delete OR Restore Buttons */}
                      {!item.isDeleted ? (
                        <button onClick={() => { const confirmed = window.confirm("Disable this product?")
                            if (confirmed) handleSoftDelete(item._id) }} className="text-red-900 hover:text-red-950 text-md">
                          <FaTrash />
                        </button>
                      ) : (
                        <button onClick={() => { const confirmed = window.confirm("Restore this product?")
                            if (confirmed) handleRestore(item._id) }} className="text-green-700 hover:text-green-900 text-md">
                          ♻
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </main>

      {/* Modal - Add Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-[90%] md:w-150 p-6 mx-auto my-10 animate-fadeIn">

            {/* Header */}
            <div className="mb-4"> <h2 className="text-xl font-bold">Add New Product</h2> </div>

            <div className="grid grid-cols-1 gap-4">

              {/* Product Name */}
              <input onChange={(e) => setProductData({ ...productData, name: e.target.value }) } value={productData.name}
                type="text" placeholder="Product Name" className="w-full px-4 py-3 border rounded-xl"/>

              {/* Product ID */}
              <input onChange={(e) => setProductData({ ...productData, productId: e.target.value }) } value={productData.productId}
                type="text" placeholder="Product Id" className="w-full px-4 py-3 border rounded-xl"/>

              {/* Product Category */}
              <select value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value }) }
                className="w-full px-4 py-3 border rounded-xl">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}> {" "} {cat.name}{" "} </option>
                ))}
              </select>

              {/* Product Collection Name */}
              <input onChange={(e) => setProductData({ ...productData, collectionName: e.target.value }) } type="text" 
                value={productData.collectionName} placeholder="Collection" className="w-full px-4 py-3 border rounded-xl"/>

              {/* Product Color */}
              <input onChange={(e) => setProductData({ ...productData, color: e.target.value }) } type="text"
                value={productData.color} placeholder="Color" className="w-full px-4 py-3 border rounded-xl"/>

              {/* Product Sizes */}
              <div>
                <p className="mb-2 text-gray-600 font-medium"> Available Sizes : </p>
                <div className="flex gap-4 flex-wrap">
                  {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                    <label key={size} className="flex items-center gap-2">
                      <input type="checkbox" value={size} checked={productData.sizes.includes(size)}
                        onChange={(e) => { const checked = e.target.checked
                          setProductData((prev) => ({ ...prev, sizes: checked
                            ? [...prev.sizes, size]
                            : prev.sizes.filter((s) => s !== size),
                          }))
                        }}/>
                        {" "}{size}{" "}
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Price */}
              <input onChange={(e) => setProductData({ ...productData, price: e.target.value }) } type="number"
                value={productData.price} placeholder="Price" className="w-full px-4 py-3 border rounded-xl"/>

              {/* Product Description */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600"> Product Description </label>
                <textarea rows="4" placeholder="Enter product description" value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value }) }
                  className="px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"/>
              </div>

              {/* Product Stock Quantity */}
              <input type="number" value={productData.stockQty}
                onChange={(e) => { const qty = Number(e.target.value)
                  setProductData({ ...productData, stockQty: qty, stockStatus: getStockStatus(qty) }) }} 
                  placeholder="Stock Quantity" className="w-full px-4 py-3 border rounded-xl"/>

              {/* Product Status */}
              <select onChange={(e) => setProductData({ ...productData, status: e.target.value }) }
                value={productData.status} className="w-full px-4 py-3 border rounded-xl">
                <option>Select Status</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>

              {/* Product Image */}
              <div>
                <label className="block mb-2 text-gray-600"> Product Image </label>
                <input type="file" accept="image/*" multiple onChange={(e) => {
                  const files = Array.from(e.target.files)
                  console.log(files)
                  setSelectedImages(files)
                }} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <Button onClick={handleAddProduct} disabled={isAdding} className="px-5 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isAdding ? (
                  <>
                    <Loader size="sm" /> Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - View & Edit Product */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-[95%] md:w-225 mx-auto my-10 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold"> {isEditing ? "Edit Product" : "Product Details"} </h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-black text-xl">
                {" "}
                ✕{" "}
              </button>
            </div>

            {/* Images Section */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-3">Product Images</p>

              {selectedProduct.images?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedProduct.images.map((img, index) => (
                    <div key={index} onClick={() => { if (!isEditing) return
                        setEditingImageIndex(index)
                        document.getElementById("imageReplaceInput").click() }}
                      className={`relative h-28 rounded-xl overflow-hidden border bg-gray-100 transition
                        ${isEditing ? "cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-black" : "cursor-not-allowed opacity-70"}`}>
                      <img src={img} alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300" />

                        {isEditing && (
                          <div className="absolute bottom-1 right-1 flex gap-1 z-20">
                            <button onClick={(e) => { e.stopPropagation()
                                moveImage(index, index - 1) }}
                              className="bg-black/80 text-white px-2 py-1 rounded text-xs hover:bg-black pointer-events-auto">
                              ⬅
                            </button>
                            <button onClick={(e) => { e.stopPropagation()
                                moveImage(index, index + 1) }}
                              className="bg-black/80 text-white px-2 py-1 rounded text-xs hover:bg-black pointer-events-auto">
                              ➡
                            </button>
                          </div>
                        )}

                      {isEditing && (
                        <div className="absolute inset-0 bg-black/30 text-white text-xs flex items-center justify-center">
                          Click to replace
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No images uploaded</p>
              )}

            </div>

            {/* Product Details */}
            <div className="space-y-6">

              {/* Name */}
              <div>
                <label className="text-xs text-gray-500">Product Name</label>
                <input type="text" disabled={!isEditing} value={selectedProduct.name} onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, name: e.target.value }) }
                  className={`w-full mt-1 px-4 py-3 border rounded-xl ${!isEditing && "bg-gray-100"}`}/>
              </div>

              {/* Category + Collection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Category</label>
                  <select disabled={!isEditing} value={selectedProduct.category?._id}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: categories.find((c) => c._id === e.target.value,) }) }
                    className={`w-full mt-1 px-4 py-3 border rounded-xl ${!isEditing && "bg-gray-100"}`}>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}> {cat.name} </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Collection</label>
                  <input type="text" disabled={!isEditing} value={selectedProduct.collectionName || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, collectionName: e.target.value }) }
                    className={`w-full mt-1 px-4 py-3 border rounded-xl ${!isEditing && "bg-gray-100"}`} />
                </div>
              </div>

              {/* Color + Product ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Color</label>
                  <input type="text" disabled={!isEditing} value={selectedProduct.color || ""} onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, color: e.target.value }) }
                    className={`w-full mt-1 px-4 py-3 border rounded-xl ${!isEditing && "bg-gray-100"}`}/>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Product ID</label>
                  <input disabled value={selectedProduct.productId || ""}
                    className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-100"/>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="text-sm font-medium mb-2">Available Sizes</p>

                {!isEditing ? (
                  /* View Only */
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes?.length > 0 ? (
                      selectedProduct.sizes.map((size) => (
                        <span key={size} className="px-4 py-1 bg-gray-200 rounded-full text-sm"> {size} </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No sizes added</p>
                    )}
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="flex flex-wrap gap-4">
                    {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <label key={size} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selectedProduct.sizes.includes(size)} onChange={(e) => {
                            const checked = e.target.checked
                            setSelectedProduct((prev) => ({ ...prev, sizes: checked
                              ? [...prev.sizes, size]
                              : prev.sizes.filter((s) => s !== size),
                            }))
                          }} />
                        {size}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <input type="number" disabled={!isEditing} value={selectedProduct.price || ""} onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, price: e.target.value }) }
                    className={`w-full mt-1 px-3 py-2 border rounded-lg ${!isEditing && "bg-gray-100"}`}/>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Stock Qty</p>
                  <input type="number" disabled={!isEditing} value={selectedProduct.stockQty} onChange={(e) => {
                      const qty = Number(e.target.value)
                      setSelectedProduct({ ...selectedProduct, stockQty: qty, stockStatus: getStockStatus(qty) })
                    }}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg ${!isEditing && "bg-gray-100"}`}/>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Stock Status</p>
                  <input disabled={!isEditing} value={selectedProduct.stockStatus || ""}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg ${!isEditing && "bg-gray-100"}`}/>
                </div>

                
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <input disabled={!isEditing} value={selectedProduct.status || ""}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg ${!isEditing && "bg-gray-100"}`}/>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium mb-2">Description</p>
                <textarea rows="4" disabled={!isEditing} value={selectedProduct.description || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value }) }
                  className={`w-full px-4 py-3 border rounded-xl resize-none ${!isEditing && "bg-gray-100"}`}/>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-400">
              <button onClick={() => setShowViewModal(false)} className="px-5 py-2 border rounded-lg">
                Close
              </button>

              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700">
                  Edit
                </button>
              ) : (
                <button onClick={handleUpdateProduct}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <input type="file" accept="image/*" hidden id="imageReplaceInput" onChange={async (e) => {
        const file = e.target.files[0]
        if (!file || editingImageIndex === null) return
        try {
          const [newImageUrl] = await uploadImagesToCloudinary([file])
          const updatedImages = [...selectedProduct.images]
          updatedImages[editingImageIndex] = newImageUrl
          setSelectedProduct({ ...selectedProduct, images: updatedImages })
          setEditingImageIndex(null)
          e.target.value = "" 
        } catch(err){
          alert("Image upload failed")
        }
      }}/>
    </div>
  )
}

export default Admin_Products