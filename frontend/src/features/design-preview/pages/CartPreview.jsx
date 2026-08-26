import React, { useState } from 'react';
import PreviewButton from '../components/PreviewButton';
import { PreviewQuantitySelector, PreviewInput } from '../components/PreviewInput';
import PreviewBadge from '../components/PreviewBadge';
import { MOCK_NEW_ARRIVALS } from '../data/previewData';

export const CartPreview = ({ onNavigate }) => {
  const [items, setItems] = useState([
    { product: MOCK_NEW_ARRIVALS[0], size: "M", qty: 1 },
    { product: MOCK_NEW_ARRIVALS[3], size: "L", qty: 1 }
  ]);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const discount = 500;
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#DED4CB] pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-serif font-normal text-[#30251F]">
              Shopping Cart
            </h1>
            <p className="text-xs text-[#76675D] mt-1">
              You have <span className="font-bold text-[#8B634B]">{items.length}</span> item(s) in your bag
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('listing')}
            className="text-xs font-semibold text-[#8B634B] hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* 2-COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ITEMS LIST (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="divide-y divide-[#DED4CB] border-b border-[#DED4CB]">
              {items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="w-20 h-24 rounded-[8px] overflow-hidden bg-[#FBF9F6] border border-[#DED4CB] shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-semibold text-[#30251F]">{item.product.name}</h4>
                    <p className="text-xs text-[#76675D]">{item.product.fit}</p>
                    <div className="pt-1 flex items-center space-x-2">
                      <span className="text-xs text-[#76675D]">Size:</span>
                      <PreviewBadge status="neutral">{item.size}</PreviewBadge>
                    </div>
                  </div>

                  <div>
                    <PreviewQuantitySelector value={item.qty} />
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#30251F]">₹{item.product.price * item.qty}</p>
                    <button type="button" className="text-xs text-[#8C2727] hover:underline mt-1 block">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY (4 Cols) */}
          <div className="lg:col-span-4 sticky top-[100px]">
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-6">
              <h3 className="text-lg font-bold text-[#30251F] border-b border-[#DED4CB] pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#76675D]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#30251F]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-[#76675D]">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#30251F]">{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between text-[#2D5A27] font-medium">
                  <span>Loyalty Discount</span>
                  <span>-₹{discount}</span>
                </div>

                <div className="pt-3 border-t border-[#DED4CB] flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#30251F]">Estimated Total</span>
                  <span className="text-2xl font-bold text-[#8B634B]">₹{total}</span>
                </div>
              </div>

              <PreviewButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => onNavigate && onNavigate('checkout')}
              >
                Proceed to Checkout
              </PreviewButton>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPreview;
