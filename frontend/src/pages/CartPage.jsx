import React, { useMemo, useEffect, useState } from "react"
import { FiTrash2, FiPlus, FiMinus, FiArrowRight } from "react-icons/fi"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import { useCart } from "../context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

const Cart = () => {

  const { cartItems, removeFromCart, updateQty, promo, applyPromo, clearPromo } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const subtotal = useMemo(() =>cartItems.reduce((acc, item) => acc + item.price * item.qty, 0 ), [cartItems])
  const shippableItems = cartItems.filter(item => item.inStock)
  const shipping = shippableItems.length > 0 ? 200 : 0
  const tax = Math.round(subtotal * 0.086)
  const total = subtotal + shipping + tax - (promo?.discount || 0)
  const hasOutOfStock = useMemo( () => cartItems.some(item => item.inStock === false), [cartItems] )

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token || token === "undefined" || token === "null") {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  const applyPromoUI = async () => {
    if(!promoCode){
      alert("Enter a promo code")
      return
    }

    try {
      const token = localStorage.getItem("userToken")
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/promos/apply`,
        {
          code: promoCode,
          cartTotal: subtotal
        },
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      )
      applyPromo({
        code: res.data.code,
        discount: res.data.discount,
        promoId: res.data.promoId
      })
    } catch(err){
      alert(err.response?.data?.message || "Invalid promo")
      clearPromo()
    }
  }

  return (
    <div className="bg-white min-h-screen pt-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl font-light tracking-tighter leading-none mb-4">
              Cart<span className="italic font-serif pl-4">Items</span>
            </h1>
          </motion.div>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium mb-2"> Your cart is empty </h2>
            <p className="text-gray-500 mb-6"> Looks like you haven't added anything yet. </p>
            <Link to="/" className="px-6 py-3 bg-black text-white rounded-md"> Continue Shopping </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">

            {/* Cart Items */}
            <div className="lg:col-span-8 divide-y divide-neutral-100">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div key={`${item._id}-${item.size}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
                    className="py-12 flex flex-col md:flex-row gap-10 first:pt-0">
                    <Link to={`/product/${item.slug}/${item._id}`} className="w-full md:w-56 aspect-3/4 bg-neutral-50 overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"/>
                    </Link>

                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-xl font-medium tracking-tight mb-1">{item.name}</h3>
                          <div className="flex gap-4 text-[9px] uppercase tracking-widest text-neutral-400">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                          </div>
                        </div>

                        <button onClick={() => removeFromCart(item._id,item.size)} className="text-neutral-300 hover:text-black p-2">
                          <FiTrash2 className="text-[16px]" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-12">
                        <div className="flex items-center gap-8 border-b border-neutral-100 pb-2">
                          <button disabled={item.qty===1} onClick={() => updateQty(item._id,item.size,item.qty-1)}
                            className="opacity-40 hover:opacity-100 disabled:opacity-10">
                            <FiMinus className="text-[14px]" />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">{item.qty}</span>
                          <button disabled={!item.inStock} onClick={() => updateQty(item._id,item.size,item.qty+1)} className="opacity-40 hover:opacity-100">
                            <FiPlus className="text-[14px]" />
                          </button>
                        </div>

                        <div className="text-lg font-light tracking-tighter italic"> ₹ {(item.price * item.qty).toLocaleString()} </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="bg-neutral-50/50 p-10 rounded-sm">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-neutral-200 pb-6 mb-8">
                  Summary
                </h2>

                <div className="space-y-4 text-xs tracking-widest uppercase text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-black">₹ {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-black">₹ {shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="text-black">₹ {tax}</span>
                  </div>

                  {promo?.discount>0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span> <span>- ₹ {promo.discount}</span>
                    </div>
                  )}

                  <div className="pt-8 flex justify-between items-baseline border-t border-neutral-200 text-black">
                    <span className="font-bold">Total</span>
                    <span className="text-3xl">₹ {total}</span>
                  </div>
                </div>

                <input value={promoCode} onChange={(e)=>setPromoCode(e.target.value.toUpperCase())} placeholder="ENTER PROMO"
                  className="w-full border-b border-neutral-200 bg-transparent py-4 mt-10 text-xs tracking-widest outline-none"/>

                <button onClick={applyPromoUI} className="w-full border mt-3 py-3 text-[10px] uppercase tracking-[0.4em] cursor-pointer">
                  Apply Code
                </button>

                {promo?.code && (
                  <p className="text-xs text-green-600 mt-2">
                    Applied: {promo.code}
                  </p>
                )}

                <button onClick={()=>navigate("/checkout")} disabled={hasOutOfStock} className="w-full mt-12 bg-black cursor-pointer
                  text-white py-6 text-[10px] uppercase tracking-[0.5em] font-bold flex items-center justify-center gap-4 group">
                  Checkout
                  <motion.span animate={{ x:[0,5,0] }} transition={{ repeat:Infinity, duration:1.5 }}>
                    <FiArrowRight className="text-[16px]" />
                  </motion.span>
                </button>

                {hasOutOfStock && (
                  <p className="text-xs text-red-500 mt-3 text-center"> Remove out-of-stock items to continue </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Cart