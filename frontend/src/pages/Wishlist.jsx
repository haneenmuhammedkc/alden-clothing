import React, { useState } from "react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import ProductCard from "../component/ProductCard"
import Modal from "../component/Modal"
import Button from "../component/Button"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

/**
 * Wishlist — Alden Clothing Timeless Editorial Luxury Saved Items Page
 * Reuses Phase 4 ProductCard in a 4-column desktop / 3-column tablet / 2-column mobile grid.
 */
const Wishlist = () => {
  const [sizeModalItem, setSizeModalItem] = useState(null)

  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5EFE8] text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Header */}
        <div className="mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
            SAVED SELECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
            WISHLIST ({wishlistItems.length})
          </h1>
        </div>

        {/* Empty Wishlist State */}
        {wishlistItems.length === 0 ? (
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-12 text-center space-y-4 max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-[#76675D] mx-auto" />
            <h2 className="text-xl font-serif text-[#30251F]">YOUR WISHLIST IS EMPTY</h2>
            <p className="text-xs text-[#76675D]">
              Save your favorite fashion pieces here while browsing our collections.
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={() => navigate("/men")}>
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>
        ) : (
          /* 4-Column Desktop / 3-Column Tablet / 2-Column Mobile Product Grid Reusing Phase 4 ProductCard */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistItems.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        )}

      </main>

      {/* Size Selection Modal if item lacks size */}
      <Modal
        isOpen={!!sizeModalItem}
        onClose={() => setSizeModalItem(null)}
        title="SELECT SIZE FOR BAG"
      >
        <div className="space-y-4 font-sans">
          <p className="text-xs text-[#76675D]">
            Please select your size to move <span className="font-semibold text-[#30251F]">{sizeModalItem?.name}</span> into your cart.
          </p>

          <div className="flex gap-2 flex-wrap pt-2">
            {sizeModalItem?.sizes?.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  addToCart(sizeModalItem, size)
                  removeFromWishlist(sizeModalItem._id)
                  setSizeModalItem(null)
                }}
                className="h-10 px-4 rounded-[6px] border border-[#DED4CB] bg-[#FBF9F6] text-xs font-bold text-[#30251F] hover:bg-[#8B634B] hover:text-white transition-colors cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>

          <div className="pt-3 flex justify-end">
            <Button variant="secondary" onClick={() => setSizeModalItem(null)}>
              CANCEL
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

export default Wishlist