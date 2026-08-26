import React, { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { ArrowLeft, CreditCard, Wallet, Plus, CheckCircle2, ShieldCheck, Truck, Tag } from "lucide-react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Button from "../component/Button"
import Input from "../component/Input"
import Modal from "../component/Modal"
import axiosInstance from "../utils/axiosInstance"

/**
 * Checkout — Alden Clothing Timeless Editorial Luxury Checkout Workspace
 * Preserves 100% of order creation, Razorpay HMAC verification, wallet balance deduction, and address logic.
 */
const Checkout = () => {
  const { cartItems, clearCart, promo, applyPromo, clearPromo } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [user, setUser] = useState(null)
  const [promoCode, setPromoCode] = useState("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", house: "", area: "", city: "", state: "", pincode: "",
    addressType: "Home", isDefault: false
  })

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  const shipping = subtotal > 5000 ? 0 : 200
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax - (promo?.discount || 0)

  // Redirect if cart is empty
  useEffect(() => {
    const allowedRoutes = ["/order-success", "/order-processing"]
    if (cartItems.length === 0 && !allowedRoutes.includes(window.location.pathname)) {
      navigate("/cart")
    }
  }, [cartItems, navigate])

  // Fetch authenticated user profile & addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const headers = { Authorization: `Bearer ${token}` }
        
        const userRes = await axiosInstance.get("/api/users/me", { headers })
        setUser(userRes.data.user)

        const addrRes = await axiosInstance.get("/api/users/address", { headers })
        setAddresses(addrRes.data || [])
        const defaultAddr = addrRes.data?.find(addr => addr.isDefault)
        if (defaultAddr) setSelectedAddress(defaultAddr)
        else if (addrRes.data?.length > 0) setSelectedAddress(addrRes.data[0])
      } catch (err) {
        console.error("Initialization failed", err)
      }
    }
    fetchData()
  }, [])

  // Place order
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("userToken")
    if (!token) return navigate("/login")
    if (!selectedAddress) {
      Swal.fire({ icon: 'error', title: 'Missing Address', text: 'Please select a delivery address.', confirmButtonColor: '#8B634B' })
      return
    }
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Auth Error', text: 'User not logged in.', confirmButtonColor: '#8B634B' })
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
          line: selectedAddress.address?.line || "",
          city: selectedAddress.address?.city || "",
          state: selectedAddress.address?.state || "",
          pincode: selectedAddress.address?.pincode || ""
        }
      },
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.qty || 1,
        size: item.size || "",
        color: item.color || ""
      })),
      subtotal, tax, shipping,
      discount: promo?.discount || 0,
      promoCode: promo?.code || null,
      total, paymentMethod
    }

    try {
      const res = await axiosInstance.post("/api/orders", orderData, { headers: { Authorization: `Bearer ${token}` } })
      const order = res.data.data
      if (paymentMethod === "wallet") {
        clearCart()
        navigate("/order-processing")
        return
      }
      if (paymentMethod === "razorpay") {
        handleRazorpayPayment(order)
      }
    } catch (error) {
      alert(error.response?.data?.message || "Order creation failed")
    }
  }

  // Razorpay payment
  const handleRazorpayPayment = async (order) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/payment/razorpay/create-order",
        { amount: order.total, orderId: order._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      )

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        handler: function (response) {
          verifyRazorpayPayment(response, order._id)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Razorpay open error:", error)
    }
  }

  // Verify Razorpay payment signature
  const verifyRazorpayPayment = async (paymentResponse, orderId) => {
    try {
      await axiosInstance.post(
        "/api/payment/razorpay/verify",
        { ...paymentResponse, orderId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      )
      clearCart()
      navigate("/order-processing")
    } catch (error) {
      console.error(error)
    }
  }

  // Apply promo
  const applyPromoCheckout = async () => {
    if (!promoCode) return
    try {
      const res = await axiosInstance.post(
        "/api/promos/apply", 
        { code: promoCode, cartTotal: subtotal },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      )
      applyPromo({ code: res.data.code, discount: res.data.discount, promoId: res.data.promoId })
    } catch (err) {
      Swal.fire({ icon: 'info', title: 'Promo Info', text: err.response?.data?.message || "Invalid promo", confirmButtonColor: '#8B634B' })
      clearPromo()
    }
  }

  // Add new address
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
      const res = await axiosInstance.post("/api/users/address", payload, { headers: { Authorization: `Bearer ${token}` } })
      const updatedAddrs = res.data.addresses || []
      setAddresses(updatedAddrs)
      if (updatedAddrs.length > 0) {
        setSelectedAddress(updatedAddrs[updatedAddrs.length - 1])
      }
      setShowAddressForm(false)
    } catch (err) {
      alert("Failed to add address")
    }
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Back Link & Header */}
        <div className="mb-8 space-y-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#76675D] hover:text-[#30251F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO CART</span>
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
            CHECKOUT & ORDER MANIFEST
          </h1>
        </div>

        {/* 7:5 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column (7 Columns: Customer Info, Addresses, Payment Options) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Identification / Contact */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-3 shadow-xs">
              <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider text-[#8B634B]">
                <span className="w-6 h-6 rounded-full bg-[#F5EFE8] border border-[#DED4CB] flex items-center justify-center text-[11px]">1</span>
                <span>CUSTOMER IDENTIFICATION</span>
              </div>
              
              {user && (
                <div className="pt-2 text-xs text-[#76675D] space-y-1">
                  <p className="text-sm font-semibold text-[#30251F] uppercase">{user.name}</p>
                  <p>EMAIL: {user.email}</p>
                  <p>PHONE: {user.phone}</p>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Address Selection */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider text-[#8B634B]">
                  <span className="w-6 h-6 rounded-full bg-[#F5EFE8] border border-[#DED4CB] flex items-center justify-center text-[11px]">2</span>
                  <span>DELIVERY DESTINATION</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs font-semibold text-[#8B634B] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  + ADD ADDRESS
                </button>
              </div>

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress?._id === addr._id
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-[8px] border cursor-pointer transition-all space-y-2 relative ${
                        isSelected
                          ? "border-[#8B634B] bg-[#FBF9F6] shadow-xs ring-1 ring-[#8B634B]"
                          : "border-[#DED4CB] bg-[#F5EFE8] hover:border-[#8B634B]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B634B]">
                          {addr.addressType || "HOME"}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8B634B]" />}
                      </div>
                      <p className="text-xs font-medium text-[#30251F]">
                        {addr.address?.line}, {addr.address?.city}
                      </p>
                      <p className="text-[11px] text-[#76675D]">
                        {addr.address?.state} — {addr.address?.pincode}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider text-[#8B634B]">
                <span className="w-6 h-6 rounded-full bg-[#F5EFE8] border border-[#DED4CB] flex items-center justify-center text-[11px]">3</span>
                <span>PAYMENT METHOD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-4 rounded-[8px] border flex items-center space-x-3 transition-all cursor-pointer ${
                    paymentMethod === "razorpay"
                      ? "border-[#8B634B] bg-[#F5EFE8] ring-1 ring-[#8B634B]"
                      : "border-[#DED4CB] bg-[#FBF9F6]"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#8B634B]" />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase text-[#30251F]">RAZORPAY</p>
                    <p className="text-[10px] text-[#76675D]">Cards, UPI, Netbanking</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-4 rounded-[8px] border flex items-center space-x-3 transition-all cursor-pointer ${
                    paymentMethod === "wallet"
                      ? "border-[#8B634B] bg-[#F5EFE8] ring-1 ring-[#8B634B]"
                      : "border-[#DED4CB] bg-[#FBF9F6]"
                  }`}
                >
                  <Wallet className="w-5 h-5 text-[#8B634B]" />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase text-[#30251F]">ALDEN WALLET</p>
                    <p className="text-[10px] text-[#76675D]">Digital Wallet Balance</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (5 Columns: Order Summary & Place Order CTA) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-6 space-y-6 shadow-xs font-sans">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-3 border-b border-[#DED4CB]">
                ORDER MANIFEST ({cartItems.length} ITEMS)
              </h2>

              {/* Items List Snapshot */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 py-2 border-b border-[#DED4CB]/40">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded bg-[#F5EFE8] shrink-0" />
                    <div className="flex-1 text-xs space-y-0.5">
                      <p className="font-medium text-[#30251F] line-clamp-1">{item.name}</p>
                      <p className="text-[#76675D]">QTY: {item.qty} {item.size && `• SIZE: ${item.size}`}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#30251F]">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2.5 text-xs text-[#76675D] pt-2">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="font-semibold text-[#30251F]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING</span>
                  <span className="font-semibold text-[#30251F]">{shipping === 0 ? "COMPLIMENTARY" : `₹${shipping}`}</span>
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
                <div className="pt-3 border-t border-[#DED4CB] flex justify-between items-baseline text-sm text-[#30251F] font-bold">
                  <span>FINAL TOTAL</span>
                  <span className="text-xl text-[#8B634B]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order Action */}
              <Button
                variant="primary"
                fullWidth
                onClick={handlePlaceOrder}
                className="h-12 text-xs"
              >
                PLACE ORDER & COMPLETE PAYMENT
              </Button>

            </div>
          </div>

        </div>

      </main>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        title="ADD NEW DELIVERY ADDRESS"
      >
        <form onSubmit={handleAddAddressCheckout} className="space-y-3 font-sans">
          <Input
            label="Full Name"
            value={newAddress.fullName}
            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
            required
          />
          <Input
            label="Contact Phone"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            required
          />
          <Input
            label="Street Address / House No."
            value={newAddress.house}
            onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <Input label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
            <Input label="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
            <Input label="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} required />
          </div>
          <div className="pt-3 flex justify-end space-x-2">
            <Button variant="secondary" type="button" onClick={() => setShowAddressForm(false)}>CANCEL</Button>
            <Button variant="primary" type="submit">SAVE ADDRESS</Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  )
}

export default Checkout