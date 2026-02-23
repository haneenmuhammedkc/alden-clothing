import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const OrderProcessing = () => {

  const navigate = useNavigate()
  
  const [statusIndex, setStatusIndex] = useState(0)
  const statuses=[ "Initializing Secure Protocol", "Verifying Encrypted Assets", "Finalizing Transaction", "Authorizing Distribution" ]

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order-success")
    }, 3000)

    // Text animation cycle for the futuristic feel
    const textInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length)
    }, 600)

    return () => {
      clearTimeout(timer)
      clearInterval(textInterval) }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden relative">

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px' }}/>
      
      {/* Animated Orbitals Backdrop */}
      <div className="absolute w-125 h-125 border border-black/5 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="absolute w-75 h-75 border border-black/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />

      <div className="relative z-10 flex flex-col items-center">

        {/* Main Futuristic Loader */}
        <div className="relative w-32 h-32 mb-12">

          {/* Inner Static Ring */}
          <div className="absolute inset-0 border-2 border-black/10 rounded-full" />
          
          {/* Spinning Outer Ring */}
          <div className="absolute inset-0 border-t-2 border-black rounded-full animate-spin" />
          
          {/* Central Pulsing Core */}
          <div className="absolute inset-4 bg-black flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(0,0,0,0.2)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="animate-pulse">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Radar Sweep Effect */}
          <div className="absolute inset-5 border border-black/5 rounded-full animate-ping opacity-20" />
        </div>

        {/* Text Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-2 font-light">
              System Processing
            </span>
            <h2 className="text-2xl font-light tracking-tighter text-black flex items-center gap-2">
              PAYMENT <span className="font-bold">ENCRYPTED</span>
            </h2>
          </div>

          <div className="h-6 overflow-hidden">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest transition-all duration-500 transform">
              {statuses[statusIndex]}...
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="w-48 h-0.5 bg-gray-100 mx-auto relative overflow-hidden mt-8">
            <div className="absolute inset-0 bg-black animate-[loading_2.5s_ease-in-out_forwards]" 
                 style={{ width: '0%', animation: 'progressMove 2.5s ease-in-out forwards' }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderProcessing