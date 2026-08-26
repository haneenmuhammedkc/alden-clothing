import React, { useEffect, useState, useMemo } from "react"
import { useLocation, Link } from "react-router-dom"
import { Filter, ArrowUpDown, ChevronDown, RotateCcw } from "lucide-react"
import ProductCard from "../component/ProductCard"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import SectionHeading from "../component/SectionHeading"
import axiosInstance from "../utils/axiosInstance"

/**
 * ProductList — Alden Clothing Timeless Editorial Luxury Catalog Page
 * 4-col desktop / 3-col tablet / 2-col mobile portrait 3:4 product grid with filtering & sorting.
 */
const ProductList = ({ category, heroImage }) => {
  const location = useLocation()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [maxPrice, setMaxPrice] = useState(25000)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/products?category=${category || ""}`)
        setProducts(res.data?.data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category])

  // Filter and sort products in memory
  const filteredProducts = useMemo(() => {
    if (!products.length) return []
    const params = new URLSearchParams(location.search)
    const searchQuery = params.get("search")?.toLowerCase() || ""
    let result = [...products]

    // Search Filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery) ||
        product.category?.name?.toLowerCase().includes(searchQuery)
      )
    }

    // Price Filter
    result = result.filter(p => (p.price || 0) <= maxPrice)

    // Sorting
    if (sortBy === "price-low") result.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === "price-high") result.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))

    return result
  }, [products, location.search, sortBy, maxPrice])

  const categoryTitle = category ? category.toUpperCase() : "COLLECTION"

  return (
    <div className="min-h-screen bg-[#F5EFE8] text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      {/* Catalog Header Banner */}
      <section className="pt-12 pb-8 px-4 md:px-8 border-b border-[#DED4CB]/60">
        <div className="max-w-[1320px] mx-auto space-y-4">
          
          {/* Breadcrumb Context */}
          <nav className="flex items-center space-x-2 text-xs text-[#76675D] uppercase tracking-wider font-sans">
            <Link to="/" className="hover:text-[#30251F] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#30251F] font-semibold">{categoryTitle}</span>
          </nav>

          {/* Section Heading */}
          <SectionHeading
            eyebrow="SEASONAL SELECTION"
            title={categoryTitle}
            description={`Contemporary essentials and refined silhouettes for ${categoryTitle.toLowerCase()}wear.`}
            align="left"
            useSerif={true}
          />

        </div>
      </section>

      {/* Toolbar & Filter Bar */}
      <section className="bg-[#FBF9F6] border-b border-[#DED4CB] sticky top-20 z-30 px-4 md:px-8 py-3.5">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
          
          {/* Left: Filter Toggle & Counter */}
          <div className="flex items-center space-x-6">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-[#30251F] font-semibold uppercase tracking-wider hover:text-[#8B634B] transition-colors cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#8B634B]" />
              <span>{showFilters ? "HIDE FILTERS" : "FILTERS"}</span>
            </button>

            <span className="text-[#76675D] uppercase tracking-wider hidden sm:inline">
              {filteredProducts.length} PIECES AVAILABLE
            </span>
          </div>

          {/* Right: Sort Selector */}
          <div className="flex items-center space-x-3">
            <span className="text-[#76675D] uppercase tracking-wider hidden sm:inline font-medium">SORT BY:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F5EFE8] border border-[#DED4CB] rounded-[4px] px-3 py-1.5 text-xs text-[#30251F] font-semibold uppercase tracking-wider focus:outline-none focus:border-[#8B634B] cursor-pointer"
              >
                <option value="newest">NEWEST ARRIVALS</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="name">ALPHABETICAL</option>
              </select>
            </div>
          </div>

        </div>

        {/* Expandable Filter Drawer */}
        {showFilters && (
          <div className="max-w-[1320px] mx-auto pt-4 pb-2 border-t border-[#DED4CB]/60 mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-sans">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#76675D] block mb-2">
                MAX PRICE: ₹{maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#8B634B] cursor-pointer"
              />
            </div>

            <div className="flex items-end space-x-3">
              <button
                type="button"
                onClick={() => { setSortBy("newest"); setMaxPrice(50000); }}
                className="flex items-center space-x-1.5 text-xs text-[#76675D] hover:text-[#30251F] uppercase font-semibold tracking-wider cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET FILTERS</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Main Catalog Grid Area */}
      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 min-h-[50vh]">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-2 border-[#DED4CB] border-t-[#8B634B] rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#76675D] font-semibold">
              LOADING COLLECTION...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <h3 className="text-lg font-serif text-[#30251F]">
              NO PRODUCTS FOUND
            </h3>
            <p className="text-xs text-[#76675D]">
              Try adjusting your filter or search criteria to explore more items.
            </p>
            <button
              type="button"
              onClick={() => { setSortBy("newest"); setMaxPrice(50000); }}
              className="mt-4 px-6 py-2.5 bg-[#8B634B] text-white text-xs font-semibold uppercase tracking-wider rounded-[6px] hover:bg-[#30251F] transition-colors"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        )}

        {/* 4-Column Desktop / 3-Column Tablet / 2-Column Mobile Product Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default ProductList