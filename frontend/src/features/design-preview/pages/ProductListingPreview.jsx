import React, { useState } from 'react';
import PrototypeProductCard from '../components/PrototypeProductCard';
import PrototypeButton from '../components/PrototypeButton';
import { PrototypeSelect } from '../components/PrototypeInput';
import { MOCK_PRODUCTS } from '../data/mockData';

export const ProductListingPreview = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter products based on mock controls
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedSize !== 'All' && !p.sizes.includes(selectedSize)) return false;
    return true;
  });

  return (
    <div className="bg-white min-h-screen text-[#0F172A] pb-16">
      
      {/* 1. BREADCRUMB & HEADER SECTION */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-[#94A3B8]">
            <span className="hover:text-[#0F172A] cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>Home</span>
            <span>/</span>
            <span className="hover:text-[#0F172A] cursor-pointer">Catalog</span>
            <span>/</span>
            <span className="text-[#0F172A] font-medium">Men's Tailored Collection</span>
          </nav>

          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] font-sans">
            Men's Apparel & Outerwear
          </h1>
          <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
            Minimalist tailored suits, heavy wool outerwear, and high-density organic knits engineered for everyday elegance.
          </p>
        </div>
      </section>

      {/* 2. FILTER & SORT TOOLBAR */}
      <section className="border-b border-[#E2E8F0] sticky top-[60px] lg:top-[72px] bg-white z-30 py-3 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Filter Toggle + Count */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center space-x-2 h-10 px-4 border border-[#CBD5E1] rounded-[4px] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{sidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            <span className="text-xs text-[#475569] font-medium">
              Showing <span className="font-bold text-[#0F172A]">{filteredProducts.length * 3}</span> Products
            </span>
          </div>

          {/* Right: Sort Control */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] hidden sm:inline-block">
              Sort By:
            </span>
            <PrototypeSelect
              options={[
                { label: "Newest Arrivals", value: "newest" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "Most Popular", value: "popular" }
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48"
            />
          </div>

        </div>
      </section>

      {/* 3. MAIN CATALOG CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DESKTOP FILTER SIDEBAR (Width: 240px) */}
          {sidebarOpen && (
            <aside className="w-full lg:w-60 shrink-0 space-y-6 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] pb-6 lg:pb-0 lg:pr-6">
              
              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Department Category
                </h3>
                <div className="space-y-2">
                  {["All", "Men", "Women", "Kids"].map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 text-sm text-[#475569] cursor-pointer hover:text-[#0F172A]">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#00412E]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Select Size
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {["All", "XS", "S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`h-9 text-xs font-semibold rounded-[4px] border transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#00412E] text-white border-[#00412E]'
                          : 'bg-white text-[#0F172A] border-[#CBD5E1] hover:border-[#00412E]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Price Range
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#475569]">
                    <span>$0</span>
                    <span className="font-semibold text-[#00412E]">$350</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="350"
                    defaultValue="350"
                    className="w-full accent-[#00412E]"
                  />
                </div>
              </div>

              {/* Color Options */}
              <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Color Palette
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#00412E] border border-white ring-2 ring-[#00412E] cursor-pointer" title="Deep Forest" />
                  <span className="w-6 h-6 rounded-full bg-[#96BF8A] border border-slate-200 cursor-pointer" title="Sage Green" />
                  <span className="w-6 h-6 rounded-full bg-[#0F172A] border border-slate-200 cursor-pointer" title="Dark Slate" />
                  <span className="w-6 h-6 rounded-full bg-white border border-slate-300 cursor-pointer" title="Pure White" />
                </div>
              </div>

              <PrototypeButton 
                variant="ghost" 
                size="sm" 
                fullWidth 
                onClick={() => { setSelectedCategory('All'); setSelectedSize('All'); }}
              >
                Reset All Filters
              </PrototypeButton>

            </aside>
          )}

          {/* PRODUCT GRID (4 Cols Desktop, 3 Tablet, 2 Mobile) */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
              {/* Duplicate array items for full catalog preview feel */}
              {[...filteredProducts, ...filteredProducts, ...filteredProducts].slice(0, 12).map((product, idx) => (
                <PrototypeProductCard
                  key={`${product.id}-${idx}`}
                  product={product}
                  onProductClick={() => onNavigate && onNavigate('details')}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#475569]">Page 1 of 3</span>
              <div className="flex items-center space-x-2">
                <PrototypeButton variant="secondary" size="sm" disabled>Previous</PrototypeButton>
                <PrototypeButton variant="primary" size="sm">1</PrototypeButton>
                <PrototypeButton variant="secondary" size="sm">2</PrototypeButton>
                <PrototypeButton variant="secondary" size="sm">3</PrototypeButton>
                <PrototypeButton variant="secondary" size="sm">Next</PrototypeButton>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ProductListingPreview;
