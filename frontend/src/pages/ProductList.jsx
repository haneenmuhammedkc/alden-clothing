import React, { useEffect, useState, useMemo } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Filter, ArrowUpDown, LayoutGrid, Search, X, Zap } from "lucide-react"
import ProductCard from "../component/ProductCard"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"

const ProductList = ({ category, heroImage }) => {

  const location = useLocation()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState([0, 100000000000])
  const [showFilters, setShowFilters] = useState(false)

  // For Product Fetching
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try{
        const res = await axios.get( `${import.meta.env.VITE_API_URL}/api/products?category=${category}` )
        setProducts(res.data?.data || [])
      } catch(error){
        console.error("Error fetching products:", error)
        setProducts([])
      } finally{
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category])

  // For Filtering and Sorting Products
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
    result = result.filter(p => (p.price || 0) <= priceRange[1])

    // Sorting
    if (sortBy === "price-low") result.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === "price-high") result.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))

    return result
  }, [products, location.search, sortBy, priceRange])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Navbar />

      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ duration: 2 }}
          className="absolute inset-0">
          <img src={heroImage} alt="Banner" className="w-full h-full object-cover grayscale"/>
          <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
        </motion.div>

        {/* Main Title Section */}
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
            <span className="text-xs uppercase tracking-[0.8em] text-zinc-500 mb-4 block">New Season</span>
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-none">
              {category}
            </h1>
          </motion.div>
        </div>

      </section>

      <div className="top-16 z-40 bg-black/90 backdrop-blur-xl border-y border-white/10">

      {/* Sort and Filter Bar */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">

          {/* Filter Section */}
          <div className="flex items-center gap-6">
             <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-zinc-400 transition-colors">
               <Filter size={14} /> 
               {showFilters ? "Close Filters" : "Filter"}
             </button>
             <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest">
               <Zap size={12} />
               <span>{filteredProducts.length} PIECES FOUND</span>
             </div>
          </div>

          {/* Sort Section */}
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest cursor-pointer group-hover:text-zinc-400">
                  <ArrowUpDown size={14} />
                  <span>Sort By: {sortBy.replace('-', ' ')}</span>
                  <ChevronDown size={14} />
               </div>
               <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-white/10 p-2 opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible transition-all flex flex-col gap-1 w-48 shadow-2xl">
                  {['newest', 'price-low', 'price-high', 'name'].map((option) => (
                    <button key={option} onClick={() => setSortBy(option)}
                      className={`text-[10px] uppercase tracking-widest p-2 text-left hover:bg-white hover:text-black
                        transition-colors ${sortBy === option ? 'bg-white/10' : ''}`}>
                      {option.replace('-', ' ')}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-zinc-900/50 border-b border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">Price Range</h4>
                  <input type="range" min="0" max="10000" step="50" value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-white bg-zinc-800 appearance-none h-1" />
                  <div className="flex justify-between mt-4 text-[10px] font-mono tracking-widest text-zinc-400">
                    <span>₹0</span>
                    <span>UP TO ₹{priceRange[1]}</span>
                  </div>
                </div>

                <div>
                   <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">Visual Mode</h4>
                   <div className="flex gap-4">
                      <button className="p-2 border border-white/20 hover:border-white transition-colors text-zinc-400"><LayoutGrid size={16}/></button>
                      <button className="p-2 border border-white/20 hover:border-white transition-colors text-zinc-400"><Search size={16}/></button>
                   </div>
                </div>

                <div className="flex items-end justify-end">
                  <button onClick={() => { setSortBy("newest"); setPriceRange([0, 10000]); }}
                    className="text-[10px] uppercase tracking-widest underline underline-offset-4 decoration-zinc-700 
                      hover:decoration-white transition-colors">
                    Reset All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-24 min-h-[60vh]">

        {/* Loading while products are shown */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-6 py-32">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full"/>
             <p className="text-[10px] uppercase tracking-[1em] text-zinc-500 animate-pulse">Syncing Database</p>
          </div>
        )}

        {/* If no products */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
            <X size={40} className="text-zinc-800 mb-6" />
            <h3 className="text-xl uppercase tracking-widest mb-2 font-light">Zero Results</h3>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Adjust your filters or search criteria</p>
          </motion.div>
        )}

        {/* Products shown */}
        {!loading && filteredProducts.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => ( <ProductCard key={product._id} product={product} /> ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ProductList