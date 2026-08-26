import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * OrderProcessing — Alden Clothing Timeless Editorial Luxury Order Processing Screen
 */
const OrderProcessing = () => {
  const navigate = useNavigate()
  
  const [statusIndex, setStatusIndex] = useState(0)
  const statuses = [
    "SECURING PAYMENT AUTHORIZATION",
    "VERIFYING INVENTORY ALLOCATION",
    "GENERATING ORDER MANIFEST",
    "PREPARING FULFILLMENT PROTOCOL"
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order-success")
    }, 3000)

    const textInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length)
    }, 650)

    return () => {
      clearTimeout(timer)
      clearInterval(textInterval)
    }
  }, [navigate, statuses.length])

  return (
    <div className="min-h-screen bg-[#F5EFE8] text-[#30251F] font-sans flex items-center justify-center p-6 selection:bg-[#8B634B] selection:text-white">
      <div className="max-w-md w-full bg-[#FBF9F6] border border-[#DED4CB] rounded-[16px] p-10 text-center space-y-6 shadow-sm">
        
        {/* Spinner Loader */}
        <div className="w-12 h-12 border-3 border-[#DED4CB] border-t-[#8B634B] rounded-full animate-spin mx-auto" />

        {/* Status Text */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B634B]">
            PLEASE WAIT
          </span>
          <h2 className="text-2xl font-serif font-normal text-[#30251F]">
            PROCESSING ORDER
          </h2>
          <p className="text-xs font-semibold text-[#76675D] uppercase tracking-wider h-5 pt-1">
            {statuses[statusIndex]}...
          </p>
        </div>

      </div>
    </div>
  )
}

export default OrderProcessing