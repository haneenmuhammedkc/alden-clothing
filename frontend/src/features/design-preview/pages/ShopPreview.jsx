import React, { useState } from 'react';
import PreviewButton from '../components/PreviewButton';
import PreviewProductCard from '../components/PreviewProductCard';
import { PreviewSelect } from '../components/PreviewInput';
import { MOCK_NEW_ARRIVALS, MOCK_CATEGORIES_8 } from '../data/previewData';

export const ShopPreview = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="border-b border-[#DED4CB] pb-6 space-y-3">
          <nav className="flex items-center space-x-2 text-xs text-[#76675D]">
            <span className="hover:text-[#30251F] cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>Home</span>
            <span>/</span>
            <span className="text-[#30251F] font-semibold">Shop Collection</span>
          </nav>

          <h1 className="text-4xl font-serif font-normal text-[#30251F] tracking-tight">
            All Collections & Catalog
          </h1>
          <p className="text-sm text-[#76675D] max-w-2xl leading-relaxed">
            Minimalist tailored suits, heavy wool outerwear, and high-density organic knits engineered for everyday elegance.
          </p>
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76675D] mr-2">Category:</span>
            {["All", "Jackets", "Shirts", "Hoodies", "Jeans", "Pants"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#8B634B] text-white'
                    : 'bg-[#F5EFE8] text-[#30251F] hover:bg-[#D8C4B4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76675D]">Sort:</span>
            <PreviewSelect
              options={[
                { label: "Newest Arrivals", value: "newest" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" }
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48"
            />
          </div>

        </div>

        {/* 4-COLUMN PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[...MOCK_NEW_ARRIVALS, ...MOCK_NEW_ARRIVALS].map((item, idx) => (
            <PreviewProductCard
              key={`${item.id}-${idx}`}
              product={item}
              onProductClick={() => onNavigate && onNavigate('details')}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShopPreview;
