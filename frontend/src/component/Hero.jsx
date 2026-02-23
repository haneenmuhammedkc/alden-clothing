import React, { useState, useEffect } from 'react'
import { assets } from "../assets/assets"
import { Link } from 'react-router-dom'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center font-sans pt-20">

      {/* Background Section */}
      <div className="absolute inset-0 z-0">

        {/* Image */}
        <img src={assets.main_img} alt="Alden Campaign" className="w-full h-full object-cover opacity-60 filter grayscale contrast-125 scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080?text=Alden+Campaign' }}/>
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]"></div>
      </div>

      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-white/40 to-transparent 
        shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-[scan_8s_linear_infinite] z-10"></div>

      {/* Content Section */}
      <div className={`relative z-20 container mx-auto px-6 flex flex-col items-center transition-all duration-1000 
        transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Top Element */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-6 bg-white/30"></div>
          <p className="text-xs tracking-widest text-white/80 font-light"> FW / / 2026 / / SIGNATURE SILHOUETTE </p>
          <div className="h-px w-6 bg-white/30"></div>
        </div>

        {/* Main Text */}
        <div className="relative group text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white font-bold leading-none mb-4 tracking-tighter">
            SIGNATURE
            <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">
              STYLE
              <span className="absolute -bottom-2 left-0 w-full h-px bg-white/20 origin-left scale-x-0 group-hover:scale-x-100
                transition-transform duration-700"></span>
            </span>
          </h1>          
        </div>

        {/* Description */}
        <p className="max-w-md text-gray-400 text-center text-xs tracking-widest leading-loose mb-12 uppercase">
          Modern heritage, reimagined with precision.
          <br />
          Sculpted silhouettes. Intelligent comfort.
        </p>

        {/* Buttons ( MEN / WOMEN ) */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link to="/men" className="group relative px-12 py-4 overflow-hidden bg-black transition-all duration-500
            hover:bg-white text-center">
            <span className="relative z-10 text-white text-[10px] font-bold tracking-[0.3em] group-hover:text-black transition-all">
              SHOP MEN
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </Link>

          <Link to="/women" className="group relative px-12 py-4 overflow-hidden bg-white transition-all duration-500
            hover:bg-blacktext-center">
            <span className="relative z-10 text-black text-[10px] font-bold tracking-[0.3em] group-hover:text-white transition-all">
              SHOP WOMEN
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </Link>
        </div>

        {/* Bottom Coordinates / Branding Decoration */}
        <div className="mt-20 w-full flex justify-between items-end opacity-20 pointer-events-none px-4 text-[10px] font-mono text-white">
          <div className="flex flex-col gap-1">
            <span>LAT: 40.7128° N</span>
            <span>LNG: 74.0060° W</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span>SYSTEM_BUILD: V.03</span>
            <span>CORE_PROTOCOL</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero