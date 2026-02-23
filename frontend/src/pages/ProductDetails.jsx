import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../component/Navbar.jsx"
import { FiTruck, FiHeart, FiX, FiCheck, FiChevronRight } from "react-icons/fi"
import { useCart } from "../context/CartContext.jsx"
import { motion, AnimatePresence } from "framer-motion"
import { useWishlist } from "../context/WishlistContext.jsx"

const StarRating = ({ rating, setRating }) => (
  <div className="flex gap-1 text-lg">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} onClick={() => {
          if (rating === star) { setRating(0) } 
          else { setRating(star) }
        }} className={`transition ${
          star <= rating ? "text-yellow-500" : "text-gray-300 hover:text-gray-500"
        }`}>
        ★
      </button>
    ))}
  </div>
)

const ProductDetails = () => {

  const { slug, id } = useParams()
  const { addToCart } = useCart()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedImage, setSelectedImage] = useState("")
  const [isFading, setIsFading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showAddedMsg, setShowAddedMsg] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [hasReviewed, setHasReviewed] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [wishlistAnim, setWishlistAnim] = useState(false)

  // To Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        )
        setProduct(res.data.data)
        setSelectedImage(res.data.data.images[0])
      } catch(error){
        console.error(error)
      } finally{
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Checks product already inside wishlist
  const isWishlisted = product && wishlistItems.some(item => item._id === product._id)

  // Image Change Animation
  const handleImageChange = (img) => {
    if (img === selectedImage) return
    setIsFading(true)
    setTimeout(() => {
      setSelectedImage(img)
      setIsFading(false)
    }, 200)
  }

  const handleBuyNow = () => {
    if (!selectedSize) return
    addToCart(product, selectedSize, true) 
    navigate("/checkout")
  }

  // For Loading and Preparing all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/product/${id}`)
      const data = res.data.data
      setReviews(data)
      if (data.length > 0) {
        const avg = data.reduce((acc, cur) => acc + cur.rating, 0) / data.length
        setAverageRating(avg.toFixed(1))
      }
      const user = JSON.parse(localStorage.getItem("user"))
      const userId = user?._id
      const already = data.some(r => r.user?._id === userId)
      setHasReviewed(already)
    } catch(err){
      console.error("Failed to load reviews", err)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [id])

  // Submit Review Function
  const handleSubmitReview = async () => {
    // Prevent submit if rating is not selected
    if (rating < 1){
      alert("Please select a rating")
      return
    }
    // Prevent empty review message
    if (!reviewText.trim()){
      alert("Review cannot be empty")
      return
    }
    // Prevent duplicate reviews from same user
    if (hasReviewed){
      alert("You already reviewed this product")
      return
    }
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        alert("Please login to submit a review")
        return
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/api/feedback/add`, {
        productId: id,
        rating,
        message: reviewText,
        type: "review"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRating(0)
      setReviewText("")
      setHasReviewed(true)
      fetchReviews() // instant UI update
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review")
    }
  }

  // wishlist toggle logic(add/remove from wishlist)
  const handleToggleWishlist = () => {
    if (!product) return
    const token = localStorage.getItem("userToken")
    if (!token){
      navigate("/login")
      return
    }
    setWishlistAnim(true)
    setTimeout(() => setWishlistAnim(false), 400)

    if (isWishlisted){
      removeFromWishlist(product._id)
      return
    }

    if (!selectedSize){
      return   // silently ignore instead of alert
    }
    const wishlistProduct = {
      _id: product._id,
      name: product.name,
      price: product.price,
      color: product.color,
      images: product.images,
      size: selectedSize,
      inStock: product.stockStatus === "In Stock"
    }
    addToWishlist(wishlistProduct)
  }

  // Size Guide Chart
  const sizeGuide = [
    ["XXS", "71.0-78.5", "30.5-32.0", "76.0-78.5", "56.0-63.5"],
    ["XS", "78.5-86.5", "33.0-34.5", "78.5-81.5", "63.5-71.0"],
    ["S", "89.0-94.0", "35.5-37.0", "81.5-84.0", "71.0-78.5"],
    ["M", "96.5-101.5", "38.0-39.5", "86.5-89.0", "78.5-86.5"],
    ["L", "106.5-114.5", "40.5-42.0", "89.0-91.5", "89.0-96.5"],
    ["XL", "117.0-122.0", "43.0-44.5", "91.5-94.0", "101.5-106.5"],
    ["XXL", "124.0-132.0", "45.5-47.0", "94.0-96.5", "109.0-114.5"]
  ]

  if(loading){ return <p className="text-center mt-32">Loading...</p> }
  if(!product){ return <p className="text-center mt-32">Product not found</p> }

  return (
    <div>
    <Navbar />

      <main className="max-w-400 mx-auto pt-26 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
          
          {/* Left Section (Image Section) */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 pt-24 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => handleImageChange(img)}
                  className={`w-20 h-24 shrink-0 bg-neutral-50 border transition-all duration-500 overflow-hidden ${
                    selectedImage === img ? "border-black scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}>
                  <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                </button>
              ))}
            </div>

            <div className="relative flex-1 bg-neutral-50 aspect-4/5 overflow-hidden group cursor-crosshair">
              <AnimatePresence mode="wait">
                <motion.img key={selectedImage} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={selectedImage} alt={product.name} className="w-full h-full object-contain"/>
              </AnimatePresence>
              <div className="absolute bottom-6 w-full flex justify-center text-[10px] tracking-[0.4em] font-black text-black uppercase opacity-20">
                Unit ID: {product._id} / {product.collectionName}
              </div>
            </div>
          </motion.div>

          {/* Right Section (Details Section) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 text-[10px] tracking-widest text-gray-400 uppercase mb-4">
              <span>Home</span> <FiChevronRight /> <span>Category</span> <FiChevronRight />
              <span className="text-black font-bold">{product.name}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-6">
              {product.name}
            </h1>

            {/* Product Price */}
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-3xl font-light tracking-tighter italic">₹{product.price.toLocaleString()}</span>
            </div>

            {/* Product Color */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <span className="text-xs tracking-widest capitalize text-neutral-400">Edition Tone:</span>
                <span className="text-sm font-black tracking-widest">{product.color}</span>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] tracking-[0.3em] font-bold uppercase text-neutral-400">Dimensionality</span>
                  <button onClick={() => setShowSizeChart(true)} className="text-[9px] tracking-[0.2em] font-black border-b 
                    border-black pb-0.5 hover:opacity-50 transition cursor-pointer">SIZE DATA</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(prev => prev === size ? "" : size)}
                      className={`py-4 text-[10px] font-black transition-all cursor-pointer duration-300 border ${
                        selectedSize === size ? "bg-black text-white border-black" : "bg-white text-black border-neutral-100 hover:border-black"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                <div className="flex gap-3">

                  {/* Add to Cart Button */}
                  <motion.button whileTap={{ scale: 0.98 }} disabled={!selectedSize || isAdding} onClick={() => {
                    const token = localStorage.getItem("userToken")
                    if (!token) {
                      navigate("/login")
                      return
                    }
                    addToCart(product, selectedSize)
                    setShowAddedMsg(true)
                    setTimeout(() => setShowAddedMsg(false), 2000)
                  }}
                    className="flex-1 bg-black text-white h-16 text-[10px] font-bold tracking-[0.3em] uppercase 
                      hover:bg-neutral-800 transition-all disabled:opacity-20 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isAdding ? (
                        <motion.div key="loader" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="absolute inset-0 flex items-center justify-center">
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </motion.div>
                      ) : showAddedMsg ? (
                        <motion.span key="success" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center justify-center gap-2">
                          <FiCheck /> ALLOCATED
                        </motion.span>
                      ) : (
                        <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          ADD TO CART
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  {/* Add to Wishlist Button */}
                  <motion.button onClick={handleToggleWishlist} animate={wishlistAnim ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }} className={`w-16 h-16 border flex items-center justify-center
                    text-xl transition-all ${isWishlisted ? "border-neutral-400" : "border-neutral-300 hover:border-black"}`}>
                    <motion.div animate={ isWishlisted
                      ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }
                      : { scale: 1 }
                    }
                      transition={{ duration: 0.4 }}>
                      <FiHeart
                        className={isWishlisted ? "fill-red-700 text-red-700" : "text-neutral-700"}/>
                    </motion.div>
                  </motion.button>
                </div>

                {/* Buy Now Button */}
                <motion.button whileTap={{ scale: 0.98 }} disabled={!selectedSize} onClick={handleBuyNow}
                  className="w-full border-2 border-black h-16 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black
                    hover:text-white transition-all disabled:opacity-20">
                  BUY NOW
                </motion.button>
              </div>

              {/* Product Stock Status */}
              <div className="flex items-center gap-3 text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                {product.stockStatus} — <FiTruck /> Global Logistics Included
              </div>

              {/* Product Description */}
              <div className="pt-10 border-t border-black/5">
                <p className="text-[9px] uppercase font-black tracking-[0.3em] mb-4 text-neutral-400">Signature Details</p>
                <p className="text-sm leading-relaxed text-neutral-600 font-light italic">"{product.description}"</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mt-30 border-t border-black pt-20">
          <div className="max-w-4xl">
            <h2 className="text-6xl font-black tracking-tighter uppercase mb-16">Feedback Loop</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-8">
                <div className="bg-neutral-50 p-10 border border-black/5">
                  <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8">Transmit Intelligence</h3>
                  <StarRating rating={rating} setRating={setRating} />
                  <textarea
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Input data here..."
                    className="w-full mt-8 bg-transparent border-b border-black/10 focus:border-black focus:outline-none py-2 text-sm transition-all"
                  />
                  <button 
                    onClick={handleSubmitReview}
                    disabled={!rating || !reviewText}
                    className="mt-8 text-[10px] font-bold tracking-[0.3em] border-b-2 border-black pb-1 hover:text-neutral-500 transition uppercase disabled:opacity-20"
                  >
                    Submit Transmission
                  </button>
                </div>
              </div>

              <div className="space-y-12 h-125 overflow-y-auto pr-4 scrollbar-hide">
                <AnimatePresence initial={false}>
                  {reviews.map((rev) => (
                    <motion.div 
                      key={rev._id}
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-b border-black/5 pb-8 mb-8"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {rev.user.firstName} {rev.isVerified && <span className="text-blue-500 ml-2">[VERIFIED]</span>}
                        </span>
                        <div className="flex text-[10px] tracking-widest">
                          {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500 font-light leading-relaxed italic">"{rev.message}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SIZE CHART MODAL */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-6"
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl p-12 relative"
            >
              <button onClick={() => setShowSizeChart(false)} className="absolute top-8 right-8 text-2xl hover:rotate-90
                transition-transform duration-300 cursor-pointer">
                <FiX />
              </button>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-12">Size Calibration</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-bold tracking-widest uppercase">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="py-4">Size</th>
                      <th>Chest</th>
                      <th>Neck</th>
                      <th>Sleeve</th>
                      <th>Waist</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-500">
                    {sizeGuide.map((row, index) => (
                      <tr key={index} className="border-b border-black/5">
                        {row.map((cell, i) => (
                          <td key={i} className="py-4 text-black">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-10 text-[9px] text-neutral-400 italic">Dimensions calculated based on standard VOID ergonomics.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetails