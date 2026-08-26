import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Button from "../component/Button"
import Modal from "../component/Modal"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import axiosInstance from "../utils/axiosInstance"
import { Heart, Truck, Check, ChevronRight, Star } from "lucide-react"

const StarRating = ({ rating, setRating }) => (
  <div className="flex gap-1 text-base text-[#8B634B]">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => {
          if (rating === star) { setRating(0) } 
          else { setRating(star) }
        }}
        className={`transition-colors cursor-pointer ${
          star <= rating ? "text-[#8B634B] fill-[#8B634B]" : "text-[#DED4CB] hover:text-[#76675D]"
        }`}
      >
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
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showAddedMsg, setShowAddedMsg] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [hasReviewed, setHasReviewed] = useState(false)

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${id}`)
        const prod = res.data.data
        setProduct(prod)
        setSelectedImage(prod?.images?.[0] || prod?.image || "")
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const isWishlisted = product && wishlistItems?.some(item => item._id === product._id)

  const handleBuyNow = () => {
    if (!selectedSize) return
    addToCart(product, selectedSize, true) 
    navigate("/checkout")
  }

  // Load reviews
  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/api/feedback/product/${id}`)
      const data = res.data.data || []
      setReviews(data)
      const user = JSON.parse(localStorage.getItem("user"))
      const userId = user?._id
      const already = data.some(r => r.user?._id === userId)
      setHasReviewed(already)
    } catch (err) {
      console.error("Failed to load reviews", err)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [id])

  // Submit review
  const handleSubmitReview = async () => {
    if (rating < 1) {
      alert("Please select a rating")
      return
    }
    if (!reviewText.trim()) {
      alert("Review cannot be empty")
      return
    }
    if (hasReviewed) {
      alert("You already reviewed this product")
      return
    }
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        alert("Please login to submit a review")
        return
      }
      await axiosInstance.post("/api/feedback/add", {
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
      fetchReviews()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review")
    }
  }

  // Wishlist toggle
  const handleToggleWishlist = () => {
    if (!product) return
    const token = localStorage.getItem("userToken")
    if (!token) {
      navigate("/login")
      return
    }
    if (isWishlisted) {
      removeFromWishlist(product._id)
      return
    }
    if (!selectedSize) {
      return // Silently ignore if size not selected
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

  const sizeGuide = [
    ["XXS", "71.0-78.5", "30.5-32.0", "76.0-78.5", "56.0-63.5"],
    ["XS", "78.5-86.5", "33.0-34.5", "78.5-81.5", "63.5-71.0"],
    ["S", "89.0-94.0", "35.5-37.0", "81.5-84.0", "71.0-78.5"],
    ["M", "96.5-101.5", "38.0-39.5", "86.5-89.0", "78.5-86.5"],
    ["L", "106.5-114.5", "40.5-42.0", "89.0-91.5", "89.0-96.5"],
    ["XL", "117.0-122.0", "43.0-44.5", "91.5-94.0", "101.5-106.5"],
    ["XXL", "124.0-132.0", "45.5-47.0", "94.0-96.5", "109.0-114.5"]
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE8] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-[#DED4CB] border-t-[#8B634B] rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#76675D] font-sans">Loading Product...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5EFE8] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-32 space-y-4 font-sans">
          <h2 className="text-2xl font-serif text-[#30251F]">PRODUCT NOT FOUND</h2>
          <Link to="/men" className="text-xs uppercase tracking-wider font-semibold text-[#8B634B] border-b border-[#8B634B]">Return to Storefront</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8] text-[#30251F] font-sans">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Breadcrumb Bar */}
        <nav className="flex items-center space-x-2 text-xs text-[#76675D] uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-[#30251F] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/men" className="hover:text-[#30251F] transition-colors">{product.category?.name || "Catalog"}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#30251F] font-semibold">{product.name}</span>
        </nav>

        {/* 7:5 Split Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Gallery (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail Stack */}
            {product.images?.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-[6px] overflow-hidden border bg-[#FBF9F6] transition-all cursor-pointer ${
                      selectedImage === img ? "border-[#8B634B] shadow-xs" : "border-[#DED4CB] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Product Image Container */}
            <div className="w-full aspect-[3/4] rounded-[12px] overflow-hidden bg-[#FBF9F6] border border-[#DED4CB] shadow-xs relative">
              <img
                src={selectedImage || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80"}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

          </div>

          {/* Right Product Details Workspace (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Product Title & Category Badge */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B634B]">
                {product.category?.name || "ALDEN TAILORING"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock Badge */}
            <div className="flex items-baseline space-x-4 pb-4 border-b border-[#DED4CB]">
              <span className="text-2xl sm:text-3xl font-semibold text-[#30251F]">
                ₹{(product.price || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2D5A27] bg-[#E8F2E6] px-2.5 py-1 rounded border border-[#A5C69F]">
                {product.stockStatus || "IN STOCK"}
              </span>
            </div>

            {/* Color/Tone */}
            {product.color && (
              <div className="flex items-center justify-between text-xs py-2 border-b border-[#DED4CB]/60">
                <span className="text-[#76675D] uppercase tracking-wider font-medium">EDITION TONE:</span>
                <span className="font-semibold text-[#30251F] uppercase">{product.color}</span>
              </div>
            )}

            {/* Size Selector Grid */}
            {product.sizes?.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#30251F]">
                    SELECT SIZE {selectedSize && <span className="text-[#8B634B]">({selectedSize})</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-[#76675D] hover:text-[#30251F] underline uppercase tracking-wider cursor-pointer"
                  >
                    SIZE GUIDE
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(prev => prev === size ? "" : size)}
                      className={`h-11 rounded-[6px] text-xs font-bold uppercase transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#8B634B] text-white shadow-xs border border-[#8B634B]"
                          : "bg-[#FBF9F6] text-[#30251F] border border-[#DED4CB] hover:border-[#8B634B]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons (Add to Cart, Buy Now, Wishlist) */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  disabled={!selectedSize}
                  onClick={() => {
                    const token = localStorage.getItem("userToken")
                    if (!token) {
                      navigate("/login")
                      return
                    }
                    addToCart(product, selectedSize)
                    setShowAddedMsg(true)
                    setTimeout(() => setShowAddedMsg(false), 2000)
                  }}
                  className="h-12"
                >
                  {showAddedMsg ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4" /> <span>ADDED TO CART</span>
                    </span>
                  ) : (
                    "ADD TO CART"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 rounded-[8px] border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isWishlisted 
                      ? "bg-[#FBF9F6] border-[#8B634B] text-[#8B634B]" 
                      : "bg-[#FBF9F6] border-[#DED4CB] text-[#30251F] hover:border-[#30251F]"
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#8B634B]" : ""}`} />
                </button>
              </div>

              <Button
                variant="outline"
                fullWidth
                disabled={!selectedSize}
                onClick={handleBuyNow}
                className="h-12"
              >
                BUY NOW
              </Button>
            </div>

            {/* Logistics Guarantee */}
            <div className="flex items-center space-x-2 text-xs text-[#76675D] pt-2">
              <Truck className="w-4 h-4 text-[#8B634B]" />
              <span>Complimentary insured shipping & returns included.</span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-[#DED4CB]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F] mb-2">
                  PRODUCT DETAILS
                </h4>
                <p className="text-xs sm:text-sm text-[#76675D] leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Customer Feedback & Reviews */}
        <section className="mt-20 pt-12 border-t border-[#DED4CB] max-w-4xl space-y-8">
          <h2 className="text-2xl font-serif text-[#30251F]">CUSTOMER REVIEWS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Submit Review Form */}
            <div className="bg-[#FBF9F6] p-6 rounded-[10px] border border-[#DED4CB] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">LEAVE A REVIEW</h3>
              <StarRating rating={rating} setRating={setRating} />
              <textarea
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts on fit, fabric, and quality..."
                className="w-full bg-[#F5EFE8] border border-[#DED4CB] rounded-[4px] p-3 text-xs text-[#30251F] focus:outline-none focus:border-[#8B634B]"
              />
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={!rating || !reviewText.trim()}
              >
                SUBMIT REVIEW
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <p className="text-xs text-[#76675D]">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-[#FBF9F6] border border-[#DED4CB] rounded-[8px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#30251F]">
                      <span>{rev.user?.firstName || "Verified Client"}</span>
                      <div className="flex text-[#8B634B]">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-[#76675D] leading-relaxed">"{rev.message}"</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

      </main>

      {/* Size Chart Modal */}
      <Modal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        title="SIZE GUIDE & MEASUREMENTS"
      >
        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DED4CB] text-[#30251F] font-bold uppercase">
                <th className="py-2.5">Size</th>
                <th>Chest (cm)</th>
                <th>Neck (cm)</th>
                <th>Sleeve (cm)</th>
                <th>Waist (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DED4CB]/60 text-[#76675D]">
              {sizeGuide.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, i) => (
                    <td key={i} className="py-2.5 font-medium text-[#30251F]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

export default ProductDetails