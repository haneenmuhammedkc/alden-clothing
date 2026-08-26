import React from 'react'
import { useNavigate } from "react-router-dom"
import { assets } from '../assets/assets'
import SectionHeading from './SectionHeading'

const Exclusive = () => {
  const navigate = useNavigate()

  const categories = [
    { name: "JACKETS", link: "/men", image: assets.Jac1 || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80" },
    { name: "T-SHIRTS", link: "/men", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80" },
    { name: "HOODIES", link: "/men", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" },
    { name: "SHIRTS", link: "/men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" },
    { name: "ACCESSORIES", link: "/women", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
    { name: "PANTS", link: "/women", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
    { name: "BAGGY", link: "/kids", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80" },
    { name: "JEANS", link: "/kids", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" }
  ]

  return (
    <section className="py-16 md:py-24 bg-[#F5EFE8] text-[#30251F] font-sans px-4 md:px-8">
      <div className="max-w-[1320px] mx-auto space-y-12">
        
        {/* Section Header */}
        <SectionHeading
          eyebrow="CURATED SELECTION"
          title="SHOP BY CATEGORY"
          description="Architectural silhouettes and everyday essentials for modern living."
          align="center"
          useSerif={true}
        />

        {/* 8 Categories Grid (4 Columns x 2 Rows) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(cat.link)}
              className="group cursor-pointer flex flex-col items-center text-center space-y-3 font-sans"
            >
              {/* Floating Neutral Apparel Image */}
              <div className="w-full aspect-[3/4] bg-[#D8C4B4]/40 rounded-[10px] overflow-hidden relative shadow-xs transition-transform duration-200 group-hover:scale-[1.02]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-95"
                  loading="lazy"
                />
              </div>

              {/* Bold Category Name */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] group-hover:text-[#8B634B] transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Exclusive