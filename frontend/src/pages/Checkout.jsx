import React, { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MapPin, CreditCard, Wallet, Plus, CheckCircle2, ShieldCheck, Truck, Tag } from "lucide-react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"

const Checkout = () => {
  const { cartItems, clearCart, promo, applyPromo, clearPromo } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [user, setUser] = useState(null)
  const [promoCode, setPromoCode] = useState("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ fullName: "", phone: "", house: "", area: "", city: "", state: "", pincode: "",
        addressType: "Home", isDefault: false })

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  const shipping = subtotal > 5000 ? 0 : 200
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax - (promo?.discount || 0)

  // Prevents users from accessing checkout when cart is empty
  useEffect(() => {
    const allowedRoutes = ["/order-success", "/order-processing"]
    if (cartItems.length === 0 && !allowedRoutes.includes(window.location.pathname)) {
      navigate("/cart")
    }
  }, [cartItems, navigate])

  // Runs once on pageload to fetch authenticated user data and saved addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const headers = { Authorization: `Bearer ${token}` }
        
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, { headers })
        setUser(userRes.data.user)

        const addrRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/address`, { headers })
        setAddresses(addrRes.data)
        const defaultAddr = addrRes.data.find(addr => addr.isDefault)
        if (defaultAddr) setSelectedAddress(defaultAddr)
      } catch (err) {
        console.error("Initialization failed", err)
      }
    }
    fetchData()
  }, [])

  // Handle Order Placement, Validates checkout data, creates order in backend
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("userToken")
    if (!token) return navigate("/login")
    if (!selectedAddress){
      Swal.fire({ icon: 'error', title: 'Missing Address', text: 'Please select a delivery address.', confirmButtonColor: '#000' })
      return
    }
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Auth Error', text: 'User not logged in.', confirmButtonColor: '#000' })
      return
    }

    const orderData = {
      customer: {
        firstName: user.name,
        lastName: "",
        phone: user.phone,
        email: user.email,
        addressType: selectedAddress.addressType || "Home",
        address: {
          line: selectedAddress.address.line,
          city: selectedAddress.address.city,
          state: selectedAddress.address.state,
          pincode: selectedAddress.address.pincode
        }
      },
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.qty || 1
      })),
      subtotal, tax, shipping,
      discount: promo?.discount || 0,
      promoCode: promo?.code || null,
      total, paymentMethod
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, { headers: { Authorization: `Bearer ${token}` } })
      const order = res.data.data
      if (paymentMethod === "wallet") {
        clearCart()
        navigate("/order-processing")
        return
      }
      if (paymentMethod === "razorpay") {
        handleRazorpayPayment(order)
      }
    } catch(error){
      alert(error.response?.data?.message || "Order creation failed")
    }
  }

  // Razorpay Payment Handler, Creates Razorpay order via backend and opens payment modal
  const handleRazorpayPayment = async (order) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/create-order`,
        { amount: order.total, orderId: order._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      )

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,

        handler: function (response) {
          console.log("RAZORPAY HANDLER FIRED", response)

          verifyRazorpayPayment(response, order._id)   // ❗ REMOVE async/await
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error("Razorpay open error:", error)
    }
  }

  // Verify Razorpay Payment, Sends payment response to backend for signature verification, clears cart and directs to processing page
  const verifyRazorpayPayment = async (paymentResponse, orderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/verify`,
        { ...paymentResponse, orderId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      )
      clearCart()
      navigate("/order-processing")
    } catch (error) {
      console.error(error)
    }
  }

  // Apply Promo Code During Checkout, Sends promo code to backend, If valid-saves discount in CartContext, If-invalid shows alert and clears existing promo
  const applyPromoCheckout = async () => {
    if (!promoCode) return
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/promos/apply`, 
        { code: promoCode, cartTotal: subtotal },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      )
      applyPromo({ code: res.data.code, discount: res.data.discount, promoId: res.data.promoId })
    } catch(err){
      Swal.fire({ icon: 'info', title: 'Promo Info', text: err.response?.data?.message || "Invalid promo", confirmButtonColor: '#000' })
      clearPromo()
    }
  }

  // Add New Address From Checkout
  const handleAddAddressCheckout = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("userToken")
      const payload = {
        firstName: newAddress.fullName,
        phone: newAddress.phone,
        addressType: newAddress.addressType,
        address: {
          line: `${newAddress.house}, ${newAddress.area}`,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode
        },
        isDefault: newAddress.isDefault
      }
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/address`, payload, { headers: { Authorization: `Bearer ${token}` } })
      setAddresses(res.data.addresses)
      setSelectedAddress(res.data.addresses[res.data.addresses.length - 1])
      setShowAddressForm(false)
    } catch(err){
      alert("Failed to add address")
    }
  }

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white pt-16">
      <Navbar />

      <motion.div initial="hidden" animate="visible" variants={containerVars}
        className="max-w-350 mx-auto px-6 lg:px-12 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Section */}
        <div className="lg:col-span-7">
          <motion.button variants={itemVars} onClick={() => navigate(-1)} 
            className="flex items-center gap-2 group mb-3 text-black/40 hover:text-black transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[11px] tracking-widest uppercase">Go Back</span>
          </motion.button>

          <motion.h1 variants={itemVars} className="text-6xl font-light tracking-tighter mb-16">
            Confirm <span className="font-medium italic">Order</span>
          </motion.h1>

          <div className="space-y-20">

            {/* Contact Section */}
            <motion.section variants={itemVars} className="relative">
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono">01</span>
                <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40">Identification</h3>
              </div>
              {user && (
                <div className="group border-l border-black/10 pl-8 space-y-2 py-2 hover:border-black transition-colors">
                  <p className="text-xl tracking-tight font-medium uppercase">{user.name}</p>
                  <p className="text-black/50 text-sm font-light">Email: <span className="font-normal"> {user.email} </span></p>
                  <p className="text-black/50 text-sm font-light">Phone: <span className="font-normal"> {user.phone} </span></p>
                  <button onClick={() => navigate("/profile")} className="text-[10px] cursor-pointer tracking-widest font-bold mt-4 block hover:underline">MODIFY</button>
                </div>
              )}
            </motion.section>

            {/* Address Section */}
            <motion.section variants={itemVars}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono">02</span>
                  <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40">Destination</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {addresses.map((addr) => (
                    <motion.div layout key={addr._id} onClick={() => setSelectedAddress(addr)} initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className={`relative p-6 cursor-pointer border transition-all duration-500 group overflow-hidden ${
                        selectedAddress?._id === addr._id
                          ? "border-black bg-black text-white shadow-2xl"
                          : "border-black/5 bg-gray-50/50 hover:bg-white hover:border-black/20"
                      }`}>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-mono tracking-widest uppercase ${selectedAddress?._id === addr._id ? "opacity-60" : "opacity-30"}`}>
                            {addr.addressType} Address
                          </span>
                          {selectedAddress?._id === addr._id && <CheckCircle2 size={16} />}
                        </div>
                        <p className={`text-sm font-medium leading-relaxed ${selectedAddress?._id === addr._id ? "text-white" : "text-black"}`}>
                          {addr.address.line}, {addr.address.city}
                        </p>
                        <p className={`text-xs mt-1 ${selectedAddress?._id === addr._id ? "text-white/60" : "text-black/40"}`}>
                          {addr.address.state} — {addr.address.pincode}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button onClick={() => setShowAddressForm(!showAddressForm)} className="p-6 border border-dashed border-black/20 flex
                  flex-col items-center justify-center gap-3 hover:border-black hover:bg-black hover:text-white transition-all duration-300">
                  <Plus size={20} />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">New Address</span>
                </button>
              </div>

              {/* Add Address Form Modal-like */}
              <AnimatePresence>
                {showAddressForm && (
                  <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} onSubmit={handleAddAddressCheckout}
                    className="mt-8 border-t border-black/10 pt-8 space-y-6 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Recipient Name</label>
                        <input className="w-full border-b border-black/10 py-2 outline-none focus:border-black transition-colors" value={newAddress.fullName} onChange={(e)=>setNewAddress({...newAddress, fullName:e.target.value})} required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Contact Phone</label>
                        <input className="w-full border-b border-black/10 py-2 outline-none focus:border-black transition-colors" value={newAddress.phone} onChange={(e)=>setNewAddress({...newAddress, phone:e.target.value})} required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Street Address / House / Building</label>
                      <input className="w-full border-b border-black/10 py-2 outline-none focus:border-black transition-colors" value={newAddress.house} onChange={(e)=>setNewAddress({...newAddress, house:e.target.value})} />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                      <input placeholder="City" className="border-b border-black/10 py-2 outline-none focus:border-black" value={newAddress.city} onChange={(e)=>setNewAddress({...newAddress, city:e.target.value})} />
                      <input placeholder="State" className="border-b border-black/10 py-2 outline-none focus:border-black" value={newAddress.state} onChange={(e)=>setNewAddress({...newAddress, state:e.target.value})} />
                      <input placeholder="Zip" className="border-b border-black/10 py-2 outline-none focus:border-black" value={newAddress.pincode} onChange={(e)=>setNewAddress({...newAddress, pincode:e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                      <button type="submit" className="px-8 py-3 bg-black text-white text-[10px] font-mono uppercase tracking-widest">Register Address</button>
                      <button type="button" onClick={()=>setShowAddressForm(false)} className="px-8 py-3 border border-black text-[10px] font-mono uppercase tracking-widest">Dismiss</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Payment Section */}
            <motion.section variants={itemVars}>
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono">03</span>
                <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40">Financials</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setPaymentMethod("razorpay")} className={`flex items-center gap-4 p-6 border transition-all
                  duration-300 ${paymentMethod === "razorpay" ? "border-black bg-black text-white" : "border-black/5opacity-50 hover:opacity-100"}`}>
                  <CreditCard size={20} />
                  <div className="text-left">
                    <p className="text-xs font-mono uppercase tracking-widest font-bold">Razorpay</p>
                    <p className="text-[10px] opacity-60 uppercase">Razorpay Secured</p>
                  </div>
                </button>
                <button onClick={() => setPaymentMethod("wallet")} className={`flex items-center gap-4 p-6 border transition-all
                  duration-300 ${paymentMethod === "wallet" ? "border-black bg-black text-white" : "border-black/5 opacity-50 hover:opacity-100"}`}>
                  <Wallet size={20} />
                  <div className="text-left">
                    <p className="text-xs font-mono uppercase tracking-widest font-bold">Wallet</p>
                    <p className="text-[10px] opacity-60 uppercase">In-App Wallet</p>
                  </div>
                </button>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Right Section (Summary) */}
        <div className="lg:col-span-5">
          <motion.div variants={itemVars} className="sticky top-32 bg-gray-50 border border-black/5 p-8 lg:p-12 overflow-hidden">

            {/* Absolute Decorative Element */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <ShieldCheck size={180} />
            </div>

            <h3 className="font-mono text-[11px] tracking-[0.4em] uppercase opacity-30 mb-10">Manifest</h3>

            <div className="space-y-6 mb-12 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + idx * 0.1 }}
                  key={item._id} className="flex gap-6 group">
                  <div className="w-16 h-20 bg-white border border-black/5 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs font-medium uppercase tracking-tight">{item.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-mono opacity-40 uppercase">Qty. {item.qty}</span>
                      <span className="text-xs font-medium italic">₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-4 pt-10 border-t border-black/10">
              <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest opacity-60">
                <span>Value</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest opacity-60">
                <div className="flex items-center gap-2">
                  <Truck size={12} />
                  <span>Logistics</span>
                </div>
                <span>{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest opacity-60">
                <span>Surcharge (Tax)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              {/* Promo Interaction */}
              <div className="pt-6 relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={14} />
                    <input value={promoCode} onChange={(e)=>setPromoCode(e.target.value.toUpperCase())} placeholder="ENTER PROMO"
                      className="w-full bg-white border border-black/5 pl-10 pr-4 py-3 text-[10px] font-mono uppercase tracking-widest
                        outline-none focus:border-black transition-colors"/>
                  </div>
                  <button onClick={applyPromoCheckout} className="px-6 bg-white border border-black text-[10px] font-bold uppercase
                    tracking-[0.2em] hover:bg-black hover:text-white transition-all cursor-pointer">
                    Apply
                  </button>
                </div>
                
                {promo?.code && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mt-4 p-3 bg-black text-white">
                    <span className="text-[9px] font-mono tracking-widest uppercase">Promo: {promo.code}</span>
                    <span className="text-xs font-bold">- ₹{promo.discount}</span>
                  </motion.div>
                )}
              </div>

              <div className="pt-10 flex justify-between items-end">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">Total Amount</span>
                <span className="text-4xl font-light tracking-tighter italic">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePlaceOrder}
              className="mt-12 w-full bg-black text-white py-6 flex items-center justify-center gap-4 hover:bg-black/90
                transition-all group overflow-hidden relative shadow-2xl cursor-pointer">
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.5em] ml-[0.5em]">Payment</span>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
            </motion.button>
            
            <p className="mt-6 text-center text-[9px] font-mono uppercase tracking-widest opacity-20">
              End-to-end encrypted transaction
            </p>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  )
}

export default Checkout