import React from 'react';
import PreviewButton from '../components/PreviewButton';
import PreviewProductCard from '../components/PreviewProductCard';
import { MOCK_NEW_ARRIVALS } from '../data/previewData';

export const WishlistPreview = ({ onNavigate }) => {
  const wishlistItems = MOCK_NEW_ARRIVALS.slice(0, 2);

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#DED4CB] pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-serif font-normal text-[#30251F]">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-[#76675D] mt-1">
              You have <span className="font-bold text-[#8B634B]">{wishlistItems.length}</span> saved item(s)
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('listing')}
            className="text-xs font-semibold text-[#8B634B] hover:underline"
          >
            Browse New Arrivals →
          </button>
        </div>

        {/* 4-COLUMN PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="space-y-3">
              <PreviewProductCard
                product={item}
                onProductClick={() => onNavigate && onNavigate('details')}
              />
              <PreviewButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => onNavigate && onNavigate('cart')}
              >
                Move to Cart
              </PreviewButton>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WishlistPreview;
