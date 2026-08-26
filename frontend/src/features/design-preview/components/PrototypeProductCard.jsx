import React, { useState } from 'react';
import PrototypeBadge from './PrototypeBadge';

/**
 * Product Card strictly adhering to DESIGN.md Section 7 & 13.
 * Features 3:4 portrait imagery, 1.03x hover scale, wishlist circular overlay button, 
 * clean typography hierarchy, and crisp 1px borders with subtle 6px border radius.
 */
export const PrototypeProductCard = ({ product, onProductClick, onWishlistToggle }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onWishlistToggle) onWishlistToggle(product, !isWishlisted);
  };

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      onClick={() => onProductClick && onProductClick(product)}
      className="group cursor-pointer bg-white border border-[#E2E8F0] rounded-md overflow-hidden transition-all duration-200 hover:shadow-xs flex flex-col"
    >
      {/* 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8FAFC]">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Top Badges Overlay (Top-Left) */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
          {product.isNew && <PrototypeBadge status="new">New</PrototypeBadge>}
          {product.isSale && <PrototypeBadge status="sale">Sale</PrototypeBadge>}
        </div>

        {/* Wishlist Overlay Button (Top-Right: 32px circular icon button with blur) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#0F172A] hover:bg-white hover:text-[#00412E] transition-all shadow-xs z-10"
          aria-label="Add to Wishlist"
        >
          <svg
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#00412E] stroke-[#00412E]' : 'fill-none stroke-currentColor'}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
      </div>

      {/* Product Metadata Footer */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-1">
        <div>
          <h4 className="text-sm font-medium text-[#0F172A] group-hover:text-[#00412E] transition-colors line-clamp-1">
            {product.name}
          </h4>
          <p className="text-xs text-[#475569] mt-0.5">
            {product.category} {product.collectionName ? `• ${product.collectionName}` : ''}
          </p>
        </div>

        <div className="pt-2 flex items-baseline space-x-2">
          <span className="text-sm font-bold text-[#00412E]">
            ${product.price?.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#94A3B8] line-through">
              ${product.originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrototypeProductCard;
