import React from "react"
import { useNavigate } from "react-router-dom"

const OrderSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">

      {/* Background Decorative Grid - Matches Processing Page */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px' }}/>

      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-black/2 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/2 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        
        {/* Animated Success Icon Container */}
        <div className="relative mb-10 group">
          
          {/* Pulsing Outer Glow */}
          <div className="absolute inset-0 bg-black/5 rounded-full scale-150 blur-xl animate-pulse" />
          
          {/* Rotating Border */}
          <div className="absolute -inset-2.5 border border-dashed border-black/20 rounded-full animate-[spin_15s_linear_infinite]" />
          
          {/* Main Icon Circle */}
          <div className="relative w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" className="relative z-10">
              <polyline points="20 6 9 17 4 12" 
                style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'drawCheck 0.8s ease-out forwards 0.5s' }}/>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-medium">
              Transaction Confirmed
            </span>
            <h1 className="text-3xl font-light tracking-tighter text-black">
              ORDER <span className="font-bold">SECURED</span>
            </h1>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed max-w-70 mx-auto font-light">
            Your purchase has been authenticated and decentralized. Prepare for distribution.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button onClick={() => navigate("/myorder")}
              className="group relative px-8 py-3 overflow-hidden rounded-none border border-black transition-all cursor-pointer">
              <div className="absolute inset-0 w-0 bg-black transition-all duration-300 ease-out group-hover:w-full" />
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase transition-colors duration-300 group-hover:text-white">
                View Orders
              </span>
            </button>

            <button onClick={() => navigate("/")}
              className="group relative px-8 py-3 overflow-hidden rounded-none bg-black border border-black transition-all cursor-pointer">
              <div className="absolute inset-0 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase transition-colors duration-300 text-white group-hover:text-black">
                Continue
              </span>
            </button>
          </div>
        </div>

        {/* Footer Detail */}
        <div className="mt-16 opacity-20 flex items-center gap-2">
          <div className="h-px w-8 bg-black" />
          <span className="text-[8px] uppercase tracking-widest font-bold">Protocol v4.0.1</span>
          <div className="h-px w-8 bg-black" />
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess