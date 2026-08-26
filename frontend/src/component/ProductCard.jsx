import React from "react"
import { useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import { useWishlist } from "../context/WishlistContext"

/**
 * ProductCard — Alden Clothing Timeless Editorial Luxury Design System
 * 3:4 Portrait photography, top-right outline heart wishlist toggle, 10px card radius, ₹ pricing.
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()

  const isWishlisted = wishlistItems?.some(item => item._id === product?._id)

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

  const handleNavigation = (e) => {
    if (e.target.closest("button")) return
    navigate(`/product/${product?.slug || "item"}/${product?._id || "0"}`)
  }

  const formattedPrice = `₹${(product?.price || 0).toLocaleString('en-IN')}`
  const originalPrice = product?.originalPrice ? `₹${(product.originalPrice).toLocaleString('en-IN')}` : null

  return (
    <div
      onClick={handleNavigation}
      className="group cursor-pointer flex flex-col justify-between bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] overflow-hidden transition-all duration-200 hover:shadow-xs font-sans"
    >
      {/* 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFE8] flex items-center justify-center">
        <img
          src={product?.images?.[0] || product?.image || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"}
          alt={product?.name || "Alden Apparel"}
          className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Wishlist Heart Toggle Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#30251F] hover:bg-white transition-all shadow-xs cursor-pointer"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-[#8B634B] stroke-[#8B634B]" : "stroke-currentColor fill-transparent"
            }`}
          />
        </button>
      </div>

      {/* Product Metadata */}
      <div className="p-4 flex flex-col justify-between space-y-2">
        <div>
          {/* Category */}
          <span className="text-xs text-[#76675D] uppercase tracking-wider block font-medium">
            {product?.category?.name || product?.category || "COLLECTION"}
          </span>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-[#30251F] group-hover:text-[#8B634B] transition-colors line-clamp-1 mt-0.5">
            {product?.name || "Essential Clothing"}
          </h3>
        </div>

        {/* Price & Discounts */}
        <div className="pt-2 border-t border-[#DED4CB]/60 flex items-center gap-2">
          <span className="text-sm sm:text-base font-semibold text-[#30251F]">
            {formattedPrice}
          </span>
          {originalPrice && (
            <span className="text-xs text-[#76675D] line-through font-normal">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard