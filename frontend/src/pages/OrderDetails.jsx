import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Button from "../component/Button"
import Badge from "../component/Badge"
import Invoice from "../component/Invoice"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { ArrowLeft, Download, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
]

const OrderTimeline = ({ status, createdAt }) => {
  const isCancelled = status === "cancelled"
  const currentIndex = isCancelled ? 0 : ORDER_STEPS.findIndex((step) => step.key === status)

  return (
    <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-6 shadow-xs font-sans">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-3 border-b border-[#DED4CB]">
        ORDER FULFILLMENT TIMELINE
      </h3>

      <div className="space-y-4">
        {ORDER_STEPS.map((step, index) => {
          if (isCancelled && index > 0) return null
          const isCompleted = index <= currentIndex

          return (
            <div key={step.key} className="flex items-center space-x-4">
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                  isCompleted ? "bg-[#8B634B] border-[#8B634B]" : "bg-[#F5EFE8] border-[#DED4CB]"
                }`}
              />
              <div className="flex-1 flex justify-between items-center text-xs">
                <span className={`font-semibold uppercase ${isCompleted ? "text-[#30251F]" : "text-[#76675D]/60"}`}>
                  {step.label}
                </span>
                {index === 0 && (
                  <span className="text-[11px] text-[#76675D]">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {isCancelled && (
          <div className="flex items-center space-x-4">
            <div className="w-3.5 h-3.5 rounded-full bg-[#8C2727] border border-[#8C2727] shrink-0" />
            <div className="flex-1 flex justify-between items-center text-xs">
              <span className="font-semibold uppercase text-[#8C2727]">ORDER CANCELLED</span>
              <span className="text-[11px] text-[#76675D]">{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * OrderDetails — Alden Clothing Timeless Editorial Luxury Order Details & PDF Invoice Page
 * Preserves 100% of html2canvas + jsPDF invoice generation logic.
 */
const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const invoiceRef = useRef()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axiosInstance.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrder(res.data.data)
      } catch (error) {
        console.error("Fetch Order Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  // PDF Invoice Generation Handler
  const handleDownloadInvoice = async () => {
    const element = invoiceRef.current
    if (!element) return

    await new Promise((resolve) => setTimeout(resolve, 300))
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    })

    const imgData = canvas.toDataURL("image/jpeg", 1.0)
    const pdf = new jsPDF("p", "mm", "a4")

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`alden-invoice-${order._id}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE8] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 space-y-3 font-sans">
          <div className="w-8 h-8 border-2 border-[#DED4CB] border-t-[#8B634B] rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#76675D]">Loading Order Manifest...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5EFE8] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="text-center py-24 space-y-4">
          <h2 className="text-2xl font-serif text-[#30251F]">ORDER NOT FOUND</h2>
          <Button variant="primary" onClick={() => navigate("/myorder")}>RETURN TO ORDERS</Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#DED4CB]">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate("/myorder")}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#76675D] hover:text-[#30251F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO ORDER HISTORY</span>
            </button>

            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
              ORDER #{order._id.slice(-6).toUpperCase()}
            </h1>
          </div>

          <Button variant="primary" onClick={handleDownloadInvoice} className="text-xs">
            <span className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>DOWNLOAD OFFICIAL INVOICE</span>
            </span>
          </Button>
        </div>

        {/* 8:4 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column (8 Columns: Items & Timeline) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Itemized Order Products */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-4 flex items-center space-x-4 shadow-xs"
                >
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-[6px] bg-[#F5EFE8] border border-[#DED4CB]/60 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-semibold text-[#30251F]">{item.name}</h3>
                    <p className="text-xs text-[#76675D]">QTY: {item.quantity || item.qty}</p>
                    <p className="text-xs font-semibold text-[#8B634B]">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <OrderTimeline status={order.orderStatus} createdAt={order.createdAt} />

          </div>

          {/* Right Column (4 Columns: Address & Total Summary) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Delivery Destination */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
                DELIVERY DESTINATION
              </h3>
              <p className="text-xs font-semibold uppercase text-[#30251F]">
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p className="text-xs text-[#76675D]">
                {order.customer?.address?.line}, {order.customer?.address?.city}
              </p>
              <p className="text-xs text-[#76675D]">
                {order.customer?.address?.state} — {order.customer?.address?.pincode}
              </p>
              <p className="text-[11px] text-[#76675D] pt-1">
                PHONE: {order.customer?.phone}
              </p>
            </div>

            {/* Price Calculations */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
                PAYMENT BREAKDOWN
              </h3>

              <div className="space-y-2 text-xs text-[#76675D]">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="font-semibold text-[#30251F]">₹{(order.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>TAX</span>
                  <span className="font-semibold text-[#30251F]">₹{(order.tax || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING</span>
                  <span className="font-semibold text-[#30251F]">
                    {order.shipping === 0 ? "COMPLIMENTARY" : `₹${order.shipping}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#2D5A27] font-semibold">
                    <span>DISCOUNT</span>
                    <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#DED4CB] flex justify-between items-baseline text-sm text-[#30251F] font-bold">
                  <span>FINAL TOTAL</span>
                  <span className="text-xl text-[#8B634B]">₹{(order.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Hidden Invoice DOM Container for html2canvas */}
        <div style={{ position: "absolute", left: "-9999px", top: "0", width: "800px", background: "#ffffff", opacity: 1 }}>
          <Invoice ref={invoiceRef} order={order} />
        </div>

      </main>

      <Footer />
    </div>
  )
}

export default OrderDetails