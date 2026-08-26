import React, { useState } from 'react';
import PreviewButton from '../components/PreviewButton';
import PreviewBadge from '../components/PreviewBadge';
import { PreviewQuantitySelector } from '../components/PreviewInput';
import { MOCK_NEW_ARRIVALS } from '../data/previewData';

export const ProductDetailsPreview = ({ onNavigate }) => {
  const product = MOCK_NEW_ARRIVALS[0]; // Essential Polo
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#76675D]">
          <span className="hover:text-[#30251F] cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>Home</span>
          <span>/</span>
          <span className="hover:text-[#30251F] cursor-pointer" onClick={() => onNavigate && onNavigate('listing')}>Shop</span>
          <span>/</span>
          <span className="text-[#30251F] font-semibold">{product.name}</span>
        </nav>

        {/* 2-COLUMN GRID (7 Cols Gallery + 5 Cols Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* GALLERY COLUMN */}
          <div className="lg:col-span-7 flex gap-4">
            <div className="w-full aspect-[3/4] rounded-[16px] overflow-hidden bg-[#FBF9F6] border border-[#DED4CB]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* DETAILS COLUMN */}
          <div className="lg:col-span-5 bg-[#FBF9F6] border border-[#DED4CB] rounded-[16px] p-6 lg:p-8 space-y-6">
            <div>
              <PreviewBadge status="new">New Arrival</PreviewBadge>
              <h1 className="text-3xl font-serif font-normal text-[#30251F] mt-2">
                {product.name}
              </h1>
              <p className="text-xs text-[#76675D] mt-1">{product.fit}</p>
            </div>

            <div className="border-b border-[#DED4CB] pb-4">
              <span className="text-2xl font-bold text-[#30251F]">{product.priceFormatted}</span>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#76675D]">
                <span>Select Size</span>
                <button type="button" className="text-[#8B634B] hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 text-xs font-semibold rounded-[6px] border transition-colors ${
                      selectedSize === sz
                        ? 'bg-[#8B634B] text-white border-[#8B634B]'
                        : 'bg-[#F5EFE8] text-[#30251F] border-[#DED4CB] hover:border-[#8B634B]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#76675D] block">Quantity</span>
              <PreviewQuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            {/* CTA Stack */}
            <div className="space-y-3 pt-2">
              <PreviewButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => onNavigate && onNavigate('cart')}
              >
                Add to Cart — {product.priceFormatted}
              </PreviewButton>

              <PreviewButton
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => onNavigate && onNavigate('checkout')}
              >
                Buy Now (Instant Checkout)
              </PreviewButton>
            </div>

            {/* Product Fabric Information */}
            <div className="border-t border-[#DED4CB] pt-4 space-y-2 text-xs text-[#76675D]">
              <h4 className="font-bold text-[#30251F] uppercase tracking-wider">Fabric & Garment Specs</h4>
              <p>100% Premium Organic Pima Cotton. Natural horn button closure. Cold water machine wash inside out.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPreview;
