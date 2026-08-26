import React, { useState, useEffect } from 'react';
import DesignPreviewNavbar from './components/DesignPreviewNavbar';
import DesignPreviewFooter from './components/DesignPreviewFooter';

// Preview Pages
import HomePreview from './pages/HomePreview';
import ShopPreview from './pages/ShopPreview';
import ProductDetailsPreview from './pages/ProductDetailsPreview';
import CartPreview from './pages/CartPreview';
import CheckoutPreview from './pages/CheckoutPreview';
import WishlistPreview from './pages/WishlistPreview';
import OrdersPreview from './pages/OrdersPreview';
import ProfilePreview from './pages/ProfilePreview';
import AdminDashboardPreview from './pages/AdminDashboardPreview';
import DesignSystemShowcase from './DesignSystemShowcase';

export const DesignPreviewContainer = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [viewportMode, setViewportMode] = useState('full'); // 'full', 'desktop', 'tablet', 'mobile'

  // Inject Cormorant Garamond & Montserrat Google Fonts if not present
  useEffect(() => {
    const fontId = 'alden-google-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Viewport width styling
  const viewportStyles = {
    full: 'w-full',
    desktop: 'max-w-[1280px] mx-auto border-x border-[#DED4CB] shadow-2xl my-4 rounded-[12px] overflow-hidden',
    tablet: 'max-w-[768px] mx-auto border-x border-[#DED4CB] shadow-2xl my-4 rounded-[12px] overflow-hidden',
    mobile: 'max-w-[390px] mx-auto border-x border-[#DED4CB] shadow-2xl my-4 rounded-[16px] overflow-hidden'
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePreview onNavigate={setCurrentPage} />;
      case 'listing':
      case 'shop':
        return <ShopPreview onNavigate={setCurrentPage} />;
      case 'details':
      case 'product':
        return <ProductDetailsPreview onNavigate={setCurrentPage} />;
      case 'cart':
        return <CartPreview onNavigate={setCurrentPage} />;
      case 'checkout':
        return <CheckoutPreview onNavigate={setCurrentPage} />;
      case 'wishlist':
        return <WishlistPreview onNavigate={setCurrentPage} />;
      case 'orders':
        return <OrdersPreview onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePreview onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboardPreview onNavigate={setCurrentPage} />;
      case 'showcase':
        return <DesignSystemShowcase />;
      default:
        return <HomePreview onNavigate={setCurrentPage} />;
    }
  };

  const pagesNav = [
    { id: 'home', label: 'HOME' },
    { id: 'listing', label: 'SHOP' },
    { id: 'details', label: 'PRODUCT' },
    { id: 'cart', label: 'CART' },
    { id: 'checkout', label: 'CHECKOUT' },
    { id: 'wishlist', label: 'WISHLIST' },
    { id: 'orders', label: 'ORDERS' },
    { id: 'profile', label: 'PROFILE' },
    { id: 'admin', label: 'ADMIN' },
    { id: 'showcase', label: 'DESIGN SYSTEM' }
  ];

  const isStorefront = currentPage !== 'admin';

  return (
    <div className="bg-[#30251F] min-h-screen text-[#F5EFE8] font-sans">
      
      {/* TOP PREVIEW CONTROL BAR */}
      <header className="sticky top-0 z-50 bg-[#30251F] border-b border-[#76675D]/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        
        {/* Left Title */}
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B634B] animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-white">
            ALDEN CLOTHING — DESIGN PREVIEW
          </span>
        </div>

        {/* Center Page Links */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1">
          {pagesNav.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setCurrentPage(page.id)}
              className={`px-2.5 py-1 rounded-[4px] font-bold text-[11px] uppercase tracking-wider transition-colors ${
                currentPage === page.id
                  ? 'bg-[#8B634B] text-white'
                  : 'text-[#D8C4B4] hover:bg-[#76675D]/40 hover:text-white'
              }`}
            >
              {page.label}
            </button>
          ))}
        </nav>

        {/* Right Viewport Mode Controls */}
        <div className="flex items-center space-x-1 bg-[#1A1411] p-1 rounded-[6px] border border-[#76675D]/40">
          {[
            { id: 'full', label: 'FULL' },
            { id: 'desktop', label: 'DESKTOP 1280' },
            { id: 'tablet', label: 'TABLET 768' },
            { id: 'mobile', label: 'MOBILE 390' }
          ].map((vp) => (
            <button
              key={vp.id}
              type="button"
              onClick={() => setViewportMode(vp.id)}
              className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wider transition-colors ${
                viewportMode === vp.id
                  ? 'bg-[#8B634B] text-white'
                  : 'text-[#D8C4B4] hover:text-white'
              }`}
            >
              {vp.label}
            </button>
          ))}
        </div>

      </header>

      {/* MASTER PROTOTYPE CANVAS */}
      <div className={`transition-all duration-300 ${viewportStyles[viewportMode] || viewportStyles.full}`}>
        {isStorefront && (
          <DesignPreviewNavbar activeTab={currentPage} onNavigate={setCurrentPage} />
        )}
        
        {renderActivePage()}
        
        {isStorefront && (
          <DesignPreviewFooter onNavigate={setCurrentPage} />
        )}
      </div>

    </div>
  );
};

export default DesignPreviewContainer;
