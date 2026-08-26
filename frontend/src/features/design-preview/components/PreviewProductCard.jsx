import React, { useState } from 'react';
import PreviewBadge from './PreviewBadge';

export const PreviewProductCard = ({ product, onProductClick, onWishlistToggle }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onWishlistToggle) onWishlistToggle(product, !isWishlisted);
  };

  const mainImage = product.image || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80";
  const priceDisplay = product.priceFormatted || (product.price ? `₹${product.price}` : '₹3,499');

  return (
    <div 
      onClick={() => onProductClick && onProductClick(product)}
      className="group cursor-pointer bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] overflow-hidden transition-all duration-200 hover:shadow-xs flex flex-col justify-between"
    >
      {/* 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFE8] flex items-center justify-center">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Top Badges (Top-Left) */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10">
            <PreviewBadge status="new">New</PreviewBadge>
          </div>
        )}

        {/* Wishlist Top-Right Heart Icon */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#30251F] hover:bg-white transition-all shadow-xs z-10"
          aria-label="Wishlist"
        >
          <svg
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#8B634B] stroke-[#8B634B]' : 'fill-none stroke-currentColor'}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
      </div>

      {/* Metadata Bottom Row */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-1.5 font-sans">
        <div>
          <h4 className="text-sm font-medium text-[#30251F] group-hover:text-[#8B634B] transition-colors line-clamp-1">
            {product.name}
          </h4>
          <p className="text-xs text-[#76675D] line-clamp-1 mt-0.5">
            {product.fit || product.category || 'Classic Fit'}
          </p>
        </div>

        <div className="pt-1 flex items-baseline justify-between border-t border-[#DED4CB]/60">
          <span className="text-sm font-semibold text-[#30251F]">
            {priceDisplay}
          </span>
          {product.originalPriceFormatted && (
            <span className="text-xs text-[#76675D] line-through">
              {product.originalPriceFormatted}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewProductCard;
