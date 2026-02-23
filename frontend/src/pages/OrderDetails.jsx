import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import Invoice from "../component/Invoice"
import { motion, AnimatePresence } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"

// Order Timeline Config
const ORDER_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
]

// Futuristic Timeline
const OrderTimeline = ({ status, createdAt }) => {
  const isCancelled = status === "cancelled"
  const currentIndex = isCancelled
    ? 0
    : ORDER_STEPS.findIndex((step) => step.key === status)

  return (
    <div className="bg-white border border-black/10 p-8 relative overflow-hidden group">
      <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-10 text-black/40">
        Tracking Protocol
      </h3>

      <div className="space-y-10">
        {ORDER_STEPS.map((step, index) => {
          if (isCancelled && index > 0) return null
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <motion.div key={step.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6">
              <div className={`w-4 h-4 rounded-full border-2 ${ isCompleted
                ? "bg-black border-black scale-110"
                : "bg-white border-black/20"
                }`}/>

              <div>
                <p className={`text-sm font-bold uppercase tracking-tight ${ isCompleted ? "text-black" : "text-gray-300" }`}>
                  {step.label}
                </p>

                {index === 0 && (
                  <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase"> {new Date(createdAt).toDateString()} </p>
                )}
              </div>
            </motion.div>
          )
        })}

        {isCancelled && (
          <div className="flex items-start gap-6">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-bold uppercase text-red-600"> Order Voided </p>
              <p className="text-[10px] font-mono text-gray-400"> {new Date(createdAt).toDateString()} </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const invoiceRef = useRef()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch single order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axios.get(
          `http://localhost:4001/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setOrder(res.data.data)
      } catch (error) {
        console.error("Fetch Order Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  // Generate and download invoice as a PDF
  const handleDownloadInvoice = async () => {
    const element = invoiceRef.current
    if (!element) return

    await new Promise((resolve) => setTimeout(resolve, 300))
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
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

    pdf.save(`invoice-${order._id}.pdf`)
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-px bg-black animate-pulse" />
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase">
            Synchronizing
          </p>
        </div>
      </div>
    )
  }

  if (!order) return <p className="p-20">Order not found</p>

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-sans">

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10">
          <div className="flex items-start gap-6">
            <motion.button whileHover={{ x: -5 }} onClick={() => navigate("/myorder")}
              className="p-3 border border-black rounded-full cursor-pointer hover:bg-black/5 hover:text-black transition-all">
              <FiArrowLeft />
            </motion.button>
            <div>
              <h1 className="text-4xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                Order <span className="text-gray-500">Details</span>
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Section */}
          <div className="lg:col-span-8 space-y-12">

            {/* Products List */}
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                  className="flex flex-col md:flex-row gap-10 items-start border-b border-black/5 pb-8">

                  {/* Image */}
                  <div className="w-full md:w-64 aspect-square bg-gray-50 border border-black/5 flex items-center justify-center p-8">
                    <motion.img whileHover={{ scale: 1.05 }} src={item.image} alt={item.name}
                      className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-700"/>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold uppercase italic"> {item.name} </h2>
                    <div className="text-lg font-light"> Qty: {item.quantity} </div>
                    <div className="text-2xl"> ₹ {item.price} </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Invoice Button) */}
            <button onClick={handleDownloadInvoice} className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase
              tracking-[0.2em] hover:bg-white hover:text-black border border-black transition-all duration-300">
              Generate Invoice
            </button>
            <OrderTimeline status={order.orderStatus} createdAt={order.createdAt}/>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-4 space-y-8">
            <section className="border-t-2 border-black pt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6">
                Logistic Details
              </h3>
              <p className="text-sm uppercase">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-black/60">
                {order.customer.address.line}
              </p>
              <p className="text-sm text-black/60">
                {order.customer.address.city},{" "}
                {order.customer.address.state}
              </p>
              <p className="text-sm text-black/60">
                {order.customer.address.pincode}
              </p>
              <p className="text-[10px] font-mono text-black/40 mt-4">
                PHONE: {order.customer.phone}
              </p>
            </section>

            <section className="bg-black text-white p-8 space-y-6">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/50">
                Final
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-xs uppercase">
                  <span className="text-white/40">Subtotal</span>
                  <span>₹ {order.subtotal}</span>
                </div>

                <div className="flex justify-between text-xs uppercase">
                  <span className="text-white/40">Tax</span>
                  <span>₹ {order.tax}</span>
                </div>

                <div className="flex justify-between text-xs uppercase border-b border-white/10 pb-4">
                  <span className="text-white/40">Shipping</span>
                  <span>₹ {order.shipping}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-[10px] font-mono uppercase">
                    Total Value
                  </span>
                  <span className="text-3xl font-bold italic">
                    ₹ {order.total}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Hidden Invoice */}
        <div style={{ position: "absolute", left: "-9999px", top: "0", width: "800px", background: "#ffffff", opacity: 1 }}>
          <Invoice ref={invoiceRef} order={order} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default OrderDetails