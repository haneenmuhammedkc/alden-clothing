import React from 'react'
import { FaInstagram, FaFacebookF, FaTwitter , FaLinkedin , FaYoutube } from "react-icons/fa"
import { assets } from "../assets/assets"

const Footer = () => {

  const menuSections = [
    { title: "Curation", items: ["New Arrivals", "Menswear", "Womenswear", "Accessories", "Archive"] },
    { title: "The House", items: ["Our Story", "Sustainability", "Atelier", "Careers", "Investors"] },
    { title: "Assistance", items: ["Shipping", "Returns", "Size Guide", "Care", "Contact"] }
  ]

  return (
    <footer className="relative bg-[#050505] text-white pt-10 pb-12 px-6 lg:px-20 overflow-hidden border-t border-white/5">
      
      {/* Dynamic Background Text */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.02]">
        <span className="text-[25vw] font-black tracking-widest leading-none"> ALDEN </span>
      </div>

      <div className="max-w-350 mx-auto relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-20">
          <div className="lg:col-span-7 space-y-8">
            <img src={assets.logo} className='h-15' alt="" />
            <p className="text-white/40 font-light text-base max-w-lg leading-relaxed">
              A synthesis of classical elegance and digital-age performance. Each piece is an exploration of form, function, and the future.
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 pb-15">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-8">
              <h4 className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-bold border-l-2 border-white/20 pl-4">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] font-light text-white/50 hover:text-white transition-all duration-500 flex items-center group overflow-hidden">
                      <span className="relative inline-block">
                        {item}
                        <span className="absolute bottom-0 left-0 w-full h-px bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 space-y-12">
            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-bold border-l-2 border-white/20 pl-4">Network</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white 
                    hover:text-black hover:border-white transition-all duration-700 group">
                  <FaInstagram className="w-4 h-4 opacity-80 group-hover:opacity-100 transition" />
                </a>

                <a href="#" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white
                    hover:text-black hover:border-white transition-all duration-700 group">
                  <FaTwitter className="w-4 h-4 opacity-80 group-hover:opacity-100 transition" />
                </a>

                <a href="#" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white
                    hover:text-black hover:border-white transition-all duration-700 group">
                  <FaFacebookF className="w-4 h-4 opacity-80 group-hover:opacity-100 transition" />
                </a>

                <a href="#" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white
                    hover:text-black hover:border-white transition-all duration-700 group">
                  <FaYoutube className="w-4 h-4 opacity-80 group-hover:opacity-100 transition" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white
                    hover:text-black hover:border-white transition-all duration-700 group">
                  <FaLinkedin className="w-4 h-4 opacity-80 group-hover:opacity-100 transition" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal & Credits */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex gap-10">
            {['Privacy Policy', 'Terms of Service', 'Cookie Directive'].map((legal) => (
              <a key={legal} href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                {legal}
              </a>
            ))}
          </div>

          <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">
            © 2025 <span className="text-white/40">ALDEN & CO.</span> ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer