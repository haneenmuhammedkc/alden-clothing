import React from 'react';

export const DesignPreviewFooter = ({ onNavigate }) => {
  return (
    <footer className="bg-[#F5EFE8] border-t border-[#DED4CB] text-[#30251F] pt-16 pb-12 font-sans">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-14 border-b border-[#DED4CB]">
          
          {/* Col 1: Brand Wordmark */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-[#30251F] font-sans">
              ALDEN
            </h3>
            <p className="text-xs text-[#76675D] leading-relaxed">
              Timeless fashion made for modern living. Premium quality, responsible choice, and refined aesthetic.
            </p>
            <div className="flex items-center space-x-3 text-xs font-bold text-[#30251F]">
              <span className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center cursor-pointer hover:bg-[#8B634B] hover:text-white transition-colors">IG</span>
              <span className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center cursor-pointer hover:bg-[#8B634B] hover:text-white transition-colors">TW</span>
              <span className="w-8 h-8 rounded-full bg-[#D8C4B4] flex items-center justify-center cursor-pointer hover:bg-[#8B634B] hover:text-white transition-colors">PN</span>
            </div>
          </div>

          {/* Col 2: COMPANY */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs text-[#76675D]">
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">About Us</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Features</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Careers</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Newsletter</button></li>
            </ul>
          </div>

          {/* Col 3: HELP */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
              HELP
            </h4>
            <ul className="space-y-2 text-xs text-[#76675D]">
              <li><button type="button" onClick={() => onNavigate && onNavigate('orders')} className="hover:text-[#30251F]">Customer Support</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Delivery Details</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Terms & Conditions</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Col 4: FAQ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
              FAQ
            </h4>
            <ul className="space-y-2 text-xs text-[#76675D]">
              <li><button type="button" onClick={() => onNavigate && onNavigate('profile')} className="hover:text-[#30251F]">Account</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('orders')} className="hover:text-[#30251F]">Orders</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('orders')} className="hover:text-[#30251F]">Returns</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('checkout')} className="hover:text-[#30251F]">Payments</button></li>
            </ul>
          </div>

          {/* Col 5: RESOURCES */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
              RESOURCES
            </h4>
            <ul className="space-y-2 text-xs text-[#76675D]">
              <li><button type="button" onClick={() => onNavigate && onNavigate('details')} className="hover:text-[#30251F]">Size Guide</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('orders')} className="hover:text-[#30251F]">Track Order</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Store Locator</button></li>
              <li><button type="button" onClick={() => onNavigate && onNavigate('showcase')} className="hover:text-[#30251F]">Sustainability</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Payment Method Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#76675D] space-y-4 md:space-y-0">
          <p>© 2026 ALDEN CLOTHING. All rights reserved.</p>
          
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
  );
};

export default DesignPreviewFooter;
