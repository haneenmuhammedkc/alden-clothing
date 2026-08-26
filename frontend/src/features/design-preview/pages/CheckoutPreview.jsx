import React, { useState } from 'react';
import PreviewButton from '../components/PreviewButton';
import { PreviewInput } from '../components/PreviewInput';
import PreviewBadge from '../components/PreviewBadge';
import { MOCK_USER_PROFILE, MOCK_NEW_ARRIVALS } from '../data/previewData';

export const CheckoutPreview = ({ onNavigate }) => {
  const [selectedAddress, setSelectedAddress] = useState(MOCK_USER_PROFILE.addresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartItem = MOCK_NEW_ARRIVALS[3]; // Linen Utility Jacket
  const itemTotal = cartItem.price;

  if (orderPlaced) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-16 px-4 text-center space-y-6 max-w-2xl mx-auto font-sans">
        <div className="w-16 h-16 bg-[#E8F2E6] border border-[#A5C69F] rounded-full flex items-center justify-center mx-auto text-[#2D5A27] text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-3xl font-serif font-normal text-[#30251F]">Order Successfully Placed</h1>
        <p className="text-sm text-[#76675D]">
          Thank you for your order! Reference ID: <span className="font-bold text-[#8B634B]">ORD-2026-9912</span>. A confirmation has been sent to {MOCK_USER_PROFILE.email}.
        </p>
        <div className="pt-4 flex justify-center space-x-4">
          <PreviewButton variant="primary" onClick={() => onNavigate && onNavigate('orders')}>
            View Order History
          </PreviewButton>
          <PreviewButton variant="outline" onClick={() => setOrderPlaced(false)}>
            Back to Checkout Prototype
          </PreviewButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-8 px-4 md:px-8 space-y-8">
      <div className="max-w-[1320px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#DED4CB] pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-serif font-normal text-[#30251F]">
              Checkout & Payment
            </h1>
            <p className="text-xs text-[#76675D] mt-1">
              Select shipping destination and preferred payment method
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('cart')}
            className="text-xs font-semibold text-[#8B634B] hover:underline"
          >
            ← Back to Cart
          </button>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Shipping & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Address Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                1. Shipping Address Selection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_USER_PROFILE.addresses.map((addr) => {
                  const isSelected = selectedAddress === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`cursor-pointer rounded-[8px] p-4 border transition-all ${
                        isSelected 
                          ? 'border-[#8B634B] bg-[#FBF9F6] ring-1 ring-[#8B634B]' 
                          : 'border-[#DED4CB] bg-[#FBF9F6]/60 hover:border-[#B7A08D]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#30251F]">{addr.title}</span>
                        {addr.isDefault && <PreviewBadge status="active">Default</PreviewBadge>}
                      </div>
                      <p className="text-xs font-semibold text-[#30251F]">{addr.fullName}</p>
                      <p className="text-xs text-[#76675D] mt-1">{addr.street}</p>
                      <p className="text-xs text-[#76675D]">{addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Placeholders */}
            <div className="space-y-4 pt-4 border-t border-[#DED4CB]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                2. Select Payment Method (Visual Placeholder Only)
              </h3>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`cursor-pointer rounded-[8px] p-4 border transition-all flex items-center justify-between ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#8B634B] bg-[#FBF9F6] ring-1 ring-[#8B634B]'
                      : 'border-[#DED4CB] bg-[#FBF9F6]/60 hover:border-[#B7A08D]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="accent-[#8B634B]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#30251F]">Razorpay Secure Online Payment</h4>
                      <p className="text-[11px] text-[#76675D]">UPI, Cards, NetBanking</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-1 bg-[#30251F] text-white rounded-[4px]">
                    RAZORPAY
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`cursor-pointer rounded-[8px] p-4 border transition-all flex items-center justify-between ${
                    paymentMethod === 'wallet'
                      ? 'border-[#8B634B] bg-[#FBF9F6] ring-1 ring-[#8B634B]'
                      : 'border-[#DED4CB] bg-[#FBF9F6]/60 hover:border-[#B7A08D]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input type="radio" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="accent-[#8B634B]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#30251F]">Alden Wallet Balance</h4>
                      <p className="text-[11px] text-[#76675D]">Available: <span className="font-bold text-[#8B634B]">₹{MOCK_USER_PROFILE.walletBalance}</span></p>
                    </div>
                  </div>
                  <PreviewBadge status="active">Instant Credit</PreviewBadge>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Items Summary (5 Cols) */}
          <div className="lg:col-span-5 sticky top-[100px]">
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 space-y-6">
              <h3 className="text-base font-bold text-[#30251F] border-b border-[#DED4CB] pb-3">
                Review Item (1)
              </h3>

              <div className="flex items-center space-x-4 border-b border-[#DED4CB] pb-4">
                <div className="w-16 h-20 rounded-[8px] overflow-hidden bg-[#F5EFE8] border border-[#DED4CB] shrink-0">
                  <img src={cartItem.image} alt={cartItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-semibold text-[#30251F]">{cartItem.name}</h4>
                  <p className="text-xs text-[#76675D]">Size: L • Qty: 1</p>
                  <p className="text-xs font-bold text-[#8B634B]">{cartItem.priceFormatted}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#76675D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#30251F]">₹{itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#2D5A27] font-semibold">Complimentary</span>
                </div>
                <div className="pt-3 border-t border-[#DED4CB] flex justify-between items-baseline text-sm">
                  <span className="font-bold text-[#30251F]">Total</span>
                  <span className="text-xl font-bold text-[#8B634B]">₹{itemTotal}</span>
                </div>
              </div>

              <PreviewButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setOrderPlaced(true)}
              >
                Place Order (₹{itemTotal})
              </PreviewButton>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPreview;
