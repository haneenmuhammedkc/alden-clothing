import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from "../assets/assets"

const Hero = () => {
  return (
    <section className="bg-[#F5EFE8] text-[#30251F] font-sans px-4 md:px-8 pt-6 pb-12">
      <div className="max-w-[1320px] mx-auto rounded-[24px] lg:rounded-[36px] bg-[#D8C4B4] border border-[#B7A08D]/40 p-8 lg:p-14 shadow-xs relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] lg:min-h-[500px]">
          
          {/* HERO LEFT: EDITORIAL FASHION PHOTOGRAPHY */}
          <div className="lg:col-span-6 h-[360px] sm:h-[420px] lg:h-[480px] rounded-[20px] lg:rounded-[32px] overflow-hidden bg-[#B7A08D] shadow-xs">
            <img
              src={assets.main_img}
              alt="Alden Clothing Editorial Campaign"
              className="w-full h-full object-cover object-top"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80' }}
            />
          </div>

          {/* HERO RIGHT: EDITORIAL TYPOGRAPHY & CTAS */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
                NEW COLLECTION
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#30251F] leading-[1.02]">
                TIMELESS PIECES FOR<br />
                <span className="italic">MODERN LIVING</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#76675D] font-normal leading-relaxed max-w-md">
              Discover refined everyday essentials designed with understated elegance, architectural proportion, and premium natural fabrics.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link 
                to="/men" 
                className="px-8 py-3.5 bg-[#8B634B] text-white text-xs font-semibold uppercase tracking-wider rounded-[8px] hover:bg-[#30251F] transition-colors shadow-xs"
              >
                SHOP MEN
              </Link>
              <Link 
                to="/women" 
                className="px-8 py-3.5 bg-[#FBF9F6] text-[#30251F] border border-[#30251F] text-xs font-semibold uppercase tracking-wider rounded-[8px] hover:bg-[#30251F] hover:text-white transition-colors"
              >
                SHOP WOMEN
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero