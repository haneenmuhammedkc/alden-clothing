import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom"

const Exclusive = () => {

  const navigate = useNavigate()

  const sections = [
    { id: '01', label: "Men's", title: "EXCLUSIVE", subtitle: "DISCOVER UNIQUE STYLE", image: assets.Excm, link: "/men" },
    { id: '02', label: "Women's", title: "EXCLUSIVE", subtitle: "CURATED FOR YOU", image: assets.Excw, link: "/women" },
    { id: '03', label: "Kid's", title: "EXCLUSIVE", subtitle: "LITTLE TRENDSETTERS", image: assets.Exck, link: "/kids" }
  ]

  return (
    <section className="w-full bg-black">
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-black gap-px border-t border-white/10"> 
        {sections.map((item, index) => (
          <div key={index} onClick={() => navigate(item.link)} className="relative flex-1 group overflow-hidden bg-zinc-900 h-[60vh]
            md:h-screen transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer">

            {/* Background Image */}
            <img src={item.image} alt={item.label} 
              className="w-full h-full object-cover grayscale brightness-50 contrast-125 transition-all duration-1000 ease-out
                group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"/>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60
              transition-opacity duration-700"></div>
            
            {/* Top Section */}
            <div className="absolute top-8 left-8 flex items-center space-x-3 z-20">
              <span className="text-white font-mono text-xs tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                // {item.id}
              </span>
              <div className="h-px w-0 bg-white group-hover:w-8 transition-all duration-500 ease-in-out"></div>
            </div>

            {/* Content Section */}
            <div className="absolute inset-0 p-8 md:p-4 flex flex-col justify-end z-10">
              <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">

                {/* Label ( Men / Women / Kids ) */}
                <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-bold"> {item.label} </p>

                {/* Title ( Exclusive ) */}
                <h3 className="text-white text-5xl xl:text-8xl font-black tracking-tighter leading-[0.85]">
                  {item.title}
                  <span className="block text-transparent transition-all duration-700" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                    SYSTEM
                  </span>
                </h3>
                
                {/* Bottom Details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 gap-4 opacity-0 group-hover:opacity-100
                  transition-all duration-700 delay-100">
                  <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase max-w-37.5">
                    {item.subtitle}
                  </p>
                  
                  {/* Initialize Button */}
                  <button onClick={(e) => { e.stopPropagation(); navigate(item.link) }} className="group/btn relative self-start
                    md:self-center overflow-hidden px-8 py-3 border border-white/30 text-white text-[10px] tracking-[0.3em]
                    uppercase transition-all duration-300 hover:border-white hover:text-black cursor-pointer">
                    <span className="relative z-10">Initialize</span>
                    <div className="absolute inset-0 bg-white translate-x-full group-hover/btn:translate-x-0 transition-transform
                      duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default Exclusive