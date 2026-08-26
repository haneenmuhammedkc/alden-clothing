import React, { useState } from 'react';

export const DesignPreviewNavbar = ({ 
  cartCount = 3, 
  wishlistCount = 2, 
  activeTab = 'home',
  onNavigate 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "HOME", id: "home" },
    { label: "SHOP", id: "listing" },
    { label: "COLLECTIONS", id: "listing" },
    { label: "ABOUT US", id: "showcase" },
    { label: "CONTACT", id: "showcase" }
  ];

  const handleLinkClick = (id) => {
    if (onNavigate) onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5EFE8] border-b border-[#DED4CB] w-full font-sans">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT: Brand Logo */}
        <div 
          onClick={() => handleLinkClick('home')} 
          className="cursor-pointer flex items-center space-x-2 select-none"
        >
          <span className="text-xl font-bold tracking-tight text-[#30251F] font-sans">
            ALDEN
          </span>
        </div>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-9">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLinkClick(link.id)}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors relative py-1 ${
                activeTab === link.id ? 'text-[#30251F]' : 'text-[#76675D] hover:text-[#30251F]'
              }`}
            >
              {link.label}
              {activeTab === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B634B] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* RIGHT: Utility Controls */}
        <div className="flex items-center space-x-5 text-[#30251F]">
          {/* Search Input Field */}
          <div className="hidden lg:flex items-center bg-[#FBF9F6] border border-[#DED4CB] rounded-[6px] px-3 py-1.5 w-48">
            <svg className="w-3.5 h-3.5 text-[#76675D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-[#30251F] placeholder-[#76675D]/60 focus:outline-none w-full"
            />
          </div>

          {/* Wishlist Trigger */}
          <button 
            type="button"
            onClick={() => handleLinkClick('wishlist')}
            className="relative p-1.5 hover:text-[#8B634B] transition-colors"
            aria-label="Wishlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B7A08D] text-[#30251F] text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button 
            type="button"
            onClick={() => handleLinkClick('cart')}
            className="relative p-1.5 hover:text-[#8B634B] transition-colors"
            aria-label="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B634B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Menu Trigger */}
          <button 
            type="button"
            onClick={() => handleLinkClick('profile')}
            className="p-1.5 hover:text-[#8B634B] transition-colors"
            aria-label="User Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Mobile Hamburger Menu */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#30251F]"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F5EFE8] border-b border-[#DED4CB] px-6 py-4 space-y-3">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left py-2 text-xs font-bold uppercase text-[#30251F] border-b border-[#DED4CB]"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default DesignPreviewNavbar;
