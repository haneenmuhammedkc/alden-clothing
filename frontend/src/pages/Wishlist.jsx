import React, { useState } from "react"
import { Link } from "react-router-dom"
import { FiTrash2, FiShoppingCart } from "react-icons/fi"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

const Wishlist = () => {

  const [sizeModalItem, setSizeModalItem] = useState(null)

  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  // To Remove from Wishlist
  const handleRemove = id => { removeFromWishlist(id) }

  // Add to cart
  const handleAddToCart = (item) => {
  if (item.size) {
    addToCart(item)
    removeFromWishlist(item._id)
    return
  }
  // Otherwise open modal
  setSizeModalItem(item)
}

  return (
  <div className="min-h-screen pt-13 bg-white">
    <Navbar />

    <div className="max-w-7xl mx-auto px-10 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl font-light tracking-tighter leading-none mb-4">
            Saved<span className="italic font-serif pl-4">Items</span>
          </h1>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <span>{wishlistItems.length} Pieces</span>
          </div>
        </motion.div>
      </div>

      {/* When no products in Wishlist */}
      {wishlistItems.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center border-t border-gray-100">
          <p className="text-sm uppercase tracking-[1em] text-gray-300">Archive Empty</p>
        </motion.div>
      )}

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">

          {wishlistItems.map((item, index) => (
            <motion.div key={item._id} layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1, duration: 0.6 }} className="group relative">

              <div className="aspect-3/4 overflow-hidden bg-gray-50 relative">
                <Link to={`/product/${item.slug}/${item._id}`}>
                  <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 1.2 }} src={item.images?.[0]} alt={item.name}
                    className="w-full h-full object-cover grayscale brightness-110 contrast-110 transition-all duration-700 group-hover:grayscale-0"/>
                </Link>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none">
                  <button onClick={() => handleRemove(item._id)} className="absolute top-6 right-6 w-10 h-10 bg-white flex items-center
                    justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black
                    hover:text-white shadow-xl">
                    <FiTrash2 />
                  </button>
                </div>

                <button onClick={() => handleAddToCart(item)} className="absolute bottom-0 left-0 w-full py-6 bg-black text-white
                  text-[10px] uppercase tracking-[0.4em] font-bold translate-y-full group-hover:translate-y-0 transition-transform
                  duration-500 flex items-center justify-center gap-2">
                  <FiShoppingCart /> Move to Bag
                </button>
              </div>

              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-widest">
                    {item.color || "—"} — Size {item.size || "__"}
                  </p>
                </div>
                <p className="text-sm font-light">₹{item.price}</p>
              </div>

            </motion.div>
          ))}

        </AnimatePresence>
      </div>
      <AnimatePresence>
{sizeModalItem && (
  <motion.div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
  >
    <div className="bg-white p-10 w-100">

      <h3 className="mb-6 uppercase tracking-widest text-sm">
        Select Size
      </h3>

      <div className="flex gap-3 flex-wrap">
        {sizeModalItem.sizes?.map(size => (
          <button
            key={size}
            onClick={() => {
              addToCart(sizeModalItem, size)
              removeFromWishlist(sizeModalItem._id)
              setSizeModalItem(null)
            }}
            className="border px-4 py-2 text-xs"
          >
            {size}
          </button>
        ))}
      </div>

      <button
        onClick={() => setSizeModalItem(null)}
        className="mt-6 text-xs underline"
      >
        Cancel
      </button>

    </div>
  </motion.div>
)}
</AnimatePresence>


    </div>

    <Footer />
  </div>
)
}

export default Wishlist