import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa"

const Footer = () => {
  const menuSections = [
    { 
      title: "CURATION", 
      items: [
        { name: "New Arrivals", path: "/men" }, 
        { name: "Menswear", path: "/men" }, 
        { name: "Womenswear", path: "/women" }, 
        { name: "Kids Collection", path: "/kids" }
      ] 
    },
    { 
      title: "THE HOUSE", 
      items: [
        { name: "Our Story", path: "/" }, 
        { name: "Sustainability", path: "/" }, 
        { name: "Atelier", path: "/" }, 
        { name: "Careers", path: "/" }
      ] 
    },
    { 
      title: "ASSISTANCE", 
      items: [
        { name: "Customer Support", path: "/myorder" }, 
        { name: "Size Guide", path: "/men" }, 
        { name: "Shipping & Returns", path: "/ourpolicy" }, 
        { name: "Contact Us", path: "/" }
      ] 
    }
  ]

  return (
    <footer className="bg-[#F5EFE8] border-t border-[#DED4CB] text-[#30251F] pt-16 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-[1320px] mx-auto space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-14 border-b border-[#DED4CB]">
          
          {/* Col 1: Brand Wordmark & Statement */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-[#30251F] font-sans">
              ALDEN
            </h3>
            <p className="text-xs text-[#76675D] leading-relaxed">
              Timeless fashion made for modern living. Premium quality, responsible choice, and refined aesthetic.
            </p>
            <div className="flex items-center space-x-3 text-[#30251F]">
              <a href="#" className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center hover:bg-[#8B634B] hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center hover:bg-[#8B634B] hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center hover:bg-[#8B634B] hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center hover:bg-[#8B634B] hover:text-white transition-colors" aria-label="Youtube">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cols 2-4: Navigation Columns */}
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                {section.title}
              </h4>
              <ul className="space-y-2 text-xs text-[#76675D]">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link to={item.path} className="hover:text-[#30251F] transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 5: Legal & Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
              LEGAL
            </h4>
            <ul className="space-y-2 text-xs text-[#76675D]">
              <li><Link to="/ourpolicy" className="hover:text-[#30251F]">Privacy Policy</Link></li>
              <li><Link to="/ourpolicy" className="hover:text-[#30251F]">Terms of Service</Link></li>
              <li><Link to="/ourpolicy" className="hover:text-[#30251F]">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Payment Method Badges */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-[#76675D] space-y-4 md:space-y-0">
          <p>© 2026 ALDEN & CO. ALL RIGHTS RESERVED.</p>
          
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-[#FBF9F6] text-[#30251F] font-bold text-[10px] rounded border border-[#DED4CB]">
              RAZORPAY
            </span>
            <span className="px-2.5 py-1 bg-[#FBF9F6] text-[#30251F] font-bold text-[10px] rounded border border-[#DED4CB]">
              VISA
            </span>
            <span className="px-2.5 py-1 bg-[#FBF9F6] text-[#30251F] font-bold text-[10px] rounded border border-[#DED4CB]">
              MASTERCARD
            </span>
            <span className="px-2.5 py-1 bg-[#FBF9F6] text-[#30251F] font-bold text-[10px] rounded border border-[#DED4CB]">
              ALDEN WALLET
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer