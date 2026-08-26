import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "../component/Button"
import { CheckCircle2 } from "lucide-react"

/**
 * OrderSuccess — Alden Clothing Timeless Editorial Luxury Order Success Page
 */
const OrderSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5EFE8] text-[#30251F] font-sans flex items-center justify-center p-6 selection:bg-[#8B634B] selection:text-white">
      <div className="max-w-md w-full bg-[#FBF9F6] border border-[#DED4CB] rounded-[16px] p-8 sm:p-10 text-center space-y-6 shadow-sm">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-[#E8F2E6] border border-[#A5C69F] text-[#2D5A27] flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Header & Copy */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B634B]">
            TRANSACTION CONFIRMED
          </span>
          <h1 className="text-3xl font-serif font-normal text-[#30251F]">
            ORDER SECURED
          </h1>
          <p className="text-xs text-[#76675D] leading-relaxed pt-1">
            Thank you for shopping with Alden Clothing. Your purchase order has been logged and sent to our fulfillment team.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="space-y-3 pt-4 border-t border-[#DED4CB]">
          <Button variant="primary" fullWidth onClick={() => navigate("/myorder")} className="h-11 text-xs">
            VIEW ORDER DETAILS
          </Button>

          <Button variant="secondary" fullWidth onClick={() => navigate("/")} className="h-11 text-xs">
            CONTINUE SHOPPING
          </Button>
        </div>

      </div>
    </div>
  )
}

export default OrderSuccess