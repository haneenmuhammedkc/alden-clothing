import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Heart } from "lucide-react"
import { useWishlist } from "../context/WishlistContext"
import { useNavigate } from "react-router-dom"

const ProductCard = ({ product }) => {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()
  const navigate = useNavigate()

  const isWishlisted = wishlistItems.some(
    item => item._id === product._id
  )

  const handleToggleWishlist = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const token = localStorage.getItem("userToken")
  if (!token) {
    navigate("/login")
    return
  }
  if (isWishlisted) {
    removeFromWishlist(product._id)
  } else {
    addToWishlist(product)
  }
}

  // Navigate to Product Details
  const handleNavigation = (e) => {
    if (e.target.closest("button"))
      return
    navigate(`/product/${product?.slug || "item"}/${product?._id || "0"}`)
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="group relative">
      <div onClick={handleNavigation} className="cursor-pointer block relative">

        {/* Image Section */}
        <div className="relative aspect-4/5 overflow-hidden bg-zinc-950 border border-white/5 group-hover:border-white/20 transition-all duration-700">
          <motion.img src={product?.images?.[0]} alt={product?.name} whileHover={{ scale: 1.15 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="w-full h-full object-cover grayscale brightness-50
            group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"/>

          {/* Wishlist Button */}
          <button onClick={handleToggleWishlist}
            className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-2xl
              border border-white/10 text-white transition-all duration-500 hover:bg-white hover:text-black 
              hover:border-white group-hover:translate-y-0 translate-y-2.5 opacity-0 group-hover:opacity-100">

            {/* Wishlist Button Animation */}
            <AnimatePresence mode="wait">
              <motion.div key={isWishlisted ? "active" : "inactive"} initial={{ scale: 0.5, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5, rotate: 45 }}>
                <Heart size={18} strokeWidth={1.5} className={`transition-all duration-300 ${ isWishlisted
                  ? "fill-red-600 text-red-600"
                  : "fill-transparent text-white"
                  }`}/>
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Animation for Product Card */}
          <div className="absolute bottom-0 left-0 w-full p-4 overflow-hidden">
            <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]">
              <div className="bg-white text-black p-4 flex justify-between items-center shadow-2xl">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Inspect Item</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">

              {/* Category Name */}
              <span className="text-[9px] uppercase font-bold tracking-[0.6em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {product?.category?.name}
              </span>

              {/* Product Name */}
              <h3 className="text-md uppercase tracking-[0.2em] font-medium text-white group-hover:tracking-[0.25em] transition-all duration-500">
                {product?.name}
              </h3>
            </div>
            
            {/* Product Price */}
            <div className="text-right pt-5">
              <p className="text-md tracking-tighter text-zinc-400">
                ₹{(product?.price || 0).toLocaleString()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard