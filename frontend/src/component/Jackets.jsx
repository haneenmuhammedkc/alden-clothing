import React from 'react'
import { assets } from '../assets/assets'

const Jackets = () => {

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black font-sans selection:bg-white selection:text-black">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover grayscale contrast-125 scale-105 animate-slow-zoom" src={assets.Jac1} 
          alt="Premium Jacket Collection"/>
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),
          linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 lg:px-32">
        
        {/* Animated Line */}
        <div className="w-16 h-0.5 bg-white mb-8 animate-extend-line"></div>
        <div className="max-w-4xl space-y-6">

          {/* Header */}
          <div className="overflow-hidden">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none animate-reveal-up">
              OUTERWEAR <br />
              <span className="text-transparent stroke-text">LAB SERIES</span>
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-gray-300 text-sm md:text-base max-w-lg leading-relaxed tracking-wide opacity-0 animate-fade-in-up delay-300">
            ENGINEERED FOR THE ELEMENTS. CRAFTED FROM HIGH-DENSITY WOOL, 
            VEGAN LEATHER, AND ARCHIVAL WAXED COTTON. RUGGED PROTECTION 
            MEETS MONOCHROMATIC MINIMALISM.
          </p>

          {/* Button Section */}
          <div className="pt-6 opacity-0 animate-fade-in-up delay-500">
            <button className="group relative px-10 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] overflow-hidden
              transition-all duration-500 hover:text-white">
              <span className="relative z-10">EXPLORE COLLECTION</span>
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </button>
            
            {/* Bottom Texts */}
            <div className="mt-12 flex items-center gap-6 text-[10px] text-gray-500 tracking-[0.2em] cursor-crosshair">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIMITED EDITION
              </span>
              <span>/</span>
              <span>EST. 2024</span>
              <span>/</span>
              <span>001-JACKETS</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Jackets