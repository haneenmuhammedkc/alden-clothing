import React from 'react';

/**
 * Footer Specification strictly adhering to DESIGN.md Section 12.
 * Background: Dark Slate Neutral #0F172A, Text: #94A3B8, 4 Columns.
 */
export const PrototypeFooter = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F172A] text-[#94A3B8] border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Description & Statement */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-white font-sans">
              Alden<span className="text-[#96BF8A]">.</span>
            </h3>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              Minimalistic, editorial luxury apparel designed with clean lines, generous proportion, and timeless materials.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-xs font-semibold text-white hover:bg-[#00412E] cursor-pointer transition-colors">
                IG
              </span>
              <span className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-xs font-semibold text-white hover:bg-[#00412E] cursor-pointer transition-colors">
                TW
              </span>
              <span className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-xs font-semibold text-white hover:bg-[#00412E] cursor-pointer transition-colors">
                PN
              </span>
            </div>
          </div>

          {/* Col 2: Shop Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('listing')} className="hover:text-white transition-colors">
                  Men's Tailoring
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('listing')} className="hover:text-white transition-colors">
                  Women's Studio
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('listing')} className="hover:text-white transition-colors">
                  Kids Junior Capsule
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('listing')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('orders')} className="hover:text-white transition-colors">
                  Order Status & Tracking
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-white transition-colors">
                  Shipping & Returns Guarantee
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-white transition-colors">
                  Sustainability & Care Guide
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('profile')} className="hover:text-white transition-colors">
                  My Account Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Newsletter Editorial
            </h4>
            <p className="text-xs text-[#94A3B8]">
              Subscribe to receive minimalist drop alerts and capsule lookbooks.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="email"
                placeholder="Enter email address"
                className="h-10 px-3 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#96BF8A] w-full"
              />
              <button
                type="button"
                className="h-10 px-4 bg-[#00412E] text-white text-xs font-semibold rounded-md hover:bg-[#002B1F] transition-colors shrink-0"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
          <p>© 2026 Alden Clothing Inc. All rights reserved. Designed for editorial simplicity.</p>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold tracking-wider text-white border border-slate-700">
              RAZORPAY
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold tracking-wider text-white border border-slate-700">
              VISA
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold tracking-wider text-white border border-slate-700">
              MASTERCARD
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold tracking-wider text-white border border-slate-700">
              ALDEN WALLET
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PrototypeFooter;
