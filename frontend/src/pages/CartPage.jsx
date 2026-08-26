import React, { useMemo, useEffect, useState } from "react"
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Button from "../component/Button"
import Input from "../component/Input"
import QuantitySelector from "../component/QuantitySelector"
import { useCart } from "../context/CartContext"
import axiosInstance from "../utils/axiosInstance"

/**
 * CartPage — Alden Clothing Timeless Editorial Luxury Cart Workspace
 * 8:4 split layout (8 cols item list, 4 cols sticky order summary card in #FBF9F6 canvas).
 */
const Cart = () => {
  const { cartItems, removeFromCart, updateQty, promo, applyPromo, clearPromo } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0), [cartItems])
  const shippableItems = cartItems.filter(item => item.inStock)
  const shipping = shippableItems.length > 0 ? 200 : 0
  const tax = Math.round(subtotal * 0.086)
  const total = subtotal + shipping + tax - (promo?.discount || 0)
  const hasOutOfStock = useMemo(() => cartItems.some(item => item.inStock === false), [cartItems])

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token || token === "undefined" || token === "null") {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  const applyPromoUI = async () => {
    if (!promoCode) {
      alert("Enter a promo code")
      return
    }

    try {
      const token = localStorage.getItem("userToken")
      const res = await axiosInstance.post(
        "/api/promos/apply",
        { code: promoCode, cartTotal: subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      applyPromo({
        code: res.data.code,
        discount: res.data.discount,
        promoId: res.data.promoId
      })
    } catch (err) {
      alert(err.response?.data?.message || "Invalid promo")
      clearPromo()
    }
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Page Header */}
        <div className="mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
            YOUR SELECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
            SHOPPING CART ({cartItems.length})
          </h1>
        </div>

        {/* Empty Cart View */}
        {cartItems.length === 0 ? (
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-12 text-center space-y-4 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#76675D] mx-auto" />
            <h2 className="text-xl font-serif text-[#30251F]">YOUR CART IS EMPTY</h2>
            <p className="text-xs text-[#76675D]">
              Explore our contemporary collection to add items to your cart.
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={() => navigate("/men")}>
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>
        ) : (
          /* 8:4 Split Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left Cart Items List (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item._id}-${item.size}`}
                  className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center justify-between shadow-xs"
                >
                  {/* 3:4 Thumbnail Image */}
                  <Link to={`/product/${item.slug}/${item._id}`} className="w-24 h-32 shrink-0 rounded-[6px] overflow-hidden bg-[#F5EFE8] border border-[#DED4CB]/60">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  {/* Item Metadata */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-base font-medium text-[#30251F]">
                      <Link to={`/product/${item.slug}/${item._id}`} className="hover:text-[#8B634B] transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-[#76675D] uppercase font-medium justify-center sm:justify-start">
                      {item.color && <span>COLOR: {item.color}</span>}
                      {item.size && <span>• SIZE: {item.size}</span>}
                    </div>

                    <div className="text-sm font-semibold text-[#30251F]">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity Selector & Remove Action */}
                  <div className="flex items-center gap-4">
                    <QuantitySelector
                      value={item.qty}
                      min={1}
                      disabled={!item.inStock}
                      onChange={(newQty) => updateQty(item._id, item.size, newQty)}
                    />

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id, item.size)}
                      className="p-2 text-[#76675D] hover:text-[#8C2727] transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Sticky Order Summary (4 Columns) */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-6 space-y-6 shadow-xs font-sans">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-3 border-b border-[#DED4CB]">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 text-xs text-[#76675D]">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="font-semibold text-[#30251F]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>ESTIMATED SHIPPING</span>
                    <span className="font-semibold text-[#30251F]">
                      {shipping === 0 ? "COMPLIMENTARY" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>ESTIMATED TAX</span>
                    <span className="font-semibold text-[#30251F]">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  {promo?.discount > 0 && (
                    <div className="flex justify-between text-[#2D5A27] font-semibold">
                      <span>PROMO DISCOUNT ({promo.code})</span>
                      <span>- ₹{promo.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#DED4CB] flex justify-between items-baseline text-sm text-[#30251F] font-bold">
                    <span>TOTAL</span>
                    <span className="text-xl text-[#8B634B]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <div className="space-y-2 pt-2 border-t border-[#DED4CB]/60">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="h-10 px-3 bg-[#F5EFE8] border border-[#DED4CB] rounded-[4px] text-xs uppercase text-[#30251F] placeholder-[#76675D]/60 focus:outline-none focus:border-[#8B634B] flex-1"
                    />
                    <Button variant="secondary" onClick={applyPromoUI} className="h-10 text-[11px]">
                      APPLY
                    </Button>
                  </div>
                  {promo?.code && (
                    <p className="text-[11px] text-[#2D5A27] font-semibold">
                      Applied promo: {promo.code} (-₹{promo.discount})
                    </p>
                  )}
                </div>

                {/* Checkout CTA */}
                <Button
                  variant="primary"
                  fullWidth
                  disabled={hasOutOfStock}
                  onClick={() => navigate("/checkout")}
                  className="h-12 text-xs"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>

                {hasOutOfStock && (
                  <p className="text-xs text-[#8C2727] text-center font-medium">
                    Remove out-of-stock items to continue
                  </p>
                )}

              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default Cart