import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Button from './Button'

const Jackets = () => {
  const navigate = useNavigate()

  return (
    <section className="px-4 md:px-8 py-8 bg-[#F5EFE8] text-[#30251F] font-sans">
      <div className="max-w-[1320px] mx-auto rounded-[24px] lg:rounded-[36px] bg-[#D8C4B4] border border-[#B7A08D]/40 p-8 lg:p-14 shadow-xs relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Banner Copy */}
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
              AUTUMN EDITORIAL
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-[#30251F]">
              THE ART OF EVERYDAY DRESS
            </h2>
            
            <p className="text-sm text-[#76675D] leading-relaxed max-w-lg">
              Explore unstructured outerwear, high-density wool jackets, and unlined linen tailoring designed for effortless transitional layering.
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/men')}
              >
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>

          {/* Banner Campaign Image */}
          <div className="md:col-span-5 h-64 md:h-80 rounded-[20px] overflow-hidden bg-[#B7A08D] shadow-sm">
            <img
              src={assets.Jac1 || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80"}
              alt="Alden Outerwear Campaign"
              className="w-full h-full object-cover object-center"
            />
          </div>

        </div>

      </div>
    </section>
  )
}

export default Jackets