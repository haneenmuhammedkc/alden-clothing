import React, { useState } from 'react';
import PrototypeButton from '../components/PrototypeButton';
import PrototypeBadge from '../components/PrototypeBadge';
import { PrototypeInput, PrototypeSelect, PrototypeQuantitySelector } from '../components/PrototypeInput';
import PrototypeProductCard from '../components/PrototypeProductCard';
import { PrototypeModal } from '../components/PrototypeModal';
import { DESIGN_TOKENS, MOCK_PRODUCTS } from '../data/mockData';

export const DesignSystemShowcase = ({ onNavigate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [qty, setQty] = useState(2);

  return (
    <div className="bg-white min-h-screen text-[#0F172A] py-10 px-4 md:px-6 lg:px-8 space-y-16">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
          <div className="inline-flex items-center px-3 py-1 bg-[#F0F5F2] border border-[#96BF8A] rounded-[4px] text-xs font-semibold text-[#00412E]">
            DESIGN.md Authoritative Specification Showcase
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Alden Clothing Design Primitives & Tokens
          </h1>
          <p className="text-sm text-[#475569] max-w-3xl leading-relaxed">
            Visual system showcase verifying color swatches, Montserrat typography hierarchy, spatial grid spacing, border radii, button variants, badges, modals, loading skeletons, and error states.
          </p>
        </div>

        {/* 1. COLOR SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            1. Color System Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {DESIGN_TOKENS.colors.map((c, idx) => (
              <div key={idx} className="border border-[#E2E8F0] rounded-md p-3 bg-[#F8FAFC] space-y-2">
                <div
                  className="w-full h-16 rounded-[4px] border border-slate-200 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">{c.name}</h4>
                  <p className="text-[11px] font-mono text-[#00412E] font-semibold">{c.hex}</p>
                  <p className="text-[10px] text-[#475569] mt-1 leading-tight">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. TYPOGRAPHY SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            2. Typography Hierarchy (Montserrat)
          </h2>
          <div className="space-y-4 border border-[#E2E8F0] rounded-md p-6 bg-[#F8FAFC]">
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Display Heading (48px Bold)</span>
              <span className="text-4xl lg:text-5xl font-bold text-[#0F172A]">Minimalistic Luxury</span>
            </div>
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Heading 1 / H1 (36px SemiBold)</span>
              <span className="text-3xl font-semibold text-[#0F172A]">Men's Outerwear Collection</span>
            </div>
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Heading 2 / H2 (28px SemiBold)</span>
              <span className="text-2xl font-semibold text-[#0F172A]">Oversized Tailored Blazer</span>
            </div>
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Heading 3 / H3 (22px SemiBold)</span>
              <span className="text-xl font-semibold text-[#0F172A]">Customer Order Details & Invoicing</span>
            </div>
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Body Normal (14px Regular)</span>
              <p className="text-sm text-[#0F172A] leading-relaxed">
                Structured jacket tailored from premium virgin wool blend. Features clean drop shoulders and horn-style tonal buttons.
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Product Price (18px Bold #00412E)</span>
              <span className="text-lg font-bold text-[#00412E]">$180.00</span>
            </div>
          </div>
        </section>

        {/* 3. BUTTON SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            3. Button Variants (Section 9)
          </h2>
          <div className="flex flex-wrap items-center gap-4 border border-[#E2E8F0] rounded-md p-6 bg-white">
            <PrototypeButton variant="primary">Primary Button (#00412E)</PrototypeButton>
            <PrototypeButton variant="secondary">Secondary Button (#F1F5F9)</PrototypeButton>
            <PrototypeButton variant="outline">Outline Button</PrototypeButton>
            <PrototypeButton variant="ghost">Ghost Button</PrototypeButton>
            <PrototypeButton variant="danger">Danger Button (#DC2626)</PrototypeButton>
            <PrototypeButton variant="primary" disabled>Disabled State</PrototypeButton>
          </div>
        </section>

        {/* 4. INPUT & FORM SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            4. Input & Form System (Section 10)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-[#E2E8F0] rounded-md p-6 bg-[#F8FAFC]">
            <PrototypeInput label="Customer Full Name" placeholder="Alex Alden" />
            <PrototypeSelect
              label="Delivery Region"
              options={["San Francisco, CA", "New York, NY", "London, UK"]}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#475569]">Quantity Adjuster</label>
              <div>
                <PrototypeQuantitySelector value={qty} onChange={setQty} />
              </div>
            </div>
          </div>
        </section>

        {/* 5. BADGES & STATUS INDICATORS */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            5. Restrained Badges & Status System (Section 26)
          </h2>
          <div className="flex flex-wrap gap-4 border border-[#E2E8F0] rounded-md p-6 bg-white">
            <PrototypeBadge status="new">New Arrival</PrototypeBadge>
            <PrototypeBadge status="sale">Sale 18% Off</PrototypeBadge>
            <PrototypeBadge status="processing">Processing & Order Check</PrototypeBadge>
            <PrototypeBadge status="delivered">Order Delivered</PrototypeBadge>
            <PrototypeBadge status="cancelled">Cancelled</PrototypeBadge>
          </div>
        </section>

        {/* 6. PRODUCT CARD & MODALS */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            6. Product Card & Interactive Modal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3">Live Product Card Preview</h3>
              <div className="max-w-xs">
                <PrototypeProductCard product={MOCK_PRODUCTS[0]} />
              </div>
            </div>
            <div className="space-y-4 border border-[#E2E8F0] rounded-md p-6 bg-[#F8FAFC]">
              <h3 className="text-sm font-bold text-[#0F172A]">Modal Dialog Overlay Trigger</h3>
              <p className="text-xs text-[#475569]">
                Click below to launch the prototype modal following DESIGN.md specifications.
              </p>
              <PrototypeButton variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                Launch Sample Modal
              </PrototypeButton>
            </div>
          </div>
        </section>

        {/* 7. LOADING SKELETON, EMPTY STATE & ERROR STATE */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            7. Loading Skeleton, Empty State & Error State (Section 27–29)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Skeleton Shimmer */}
            <div className="border border-[#E2E8F0] rounded-md p-5 bg-white space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Loading Skeleton</h3>
              <div className="animate-pulse space-y-3">
                <div className="w-full aspect-[3/4] bg-slate-200 rounded-md" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>

            {/* Empty State */}
            <div className="border border-[#E2E8F0] rounded-md p-5 bg-[#F8FAFC] text-center space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Empty State Container</h3>
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-500 font-bold text-base">
                🛒
              </div>
              <h4 className="text-sm font-semibold text-[#0F172A]">Your Wishlist is Empty</h4>
              <p className="text-xs text-[#475569]">Save your favorite editorial pieces to inspect later.</p>
              <PrototypeButton variant="secondary" size="sm">Start Browsing</PrototypeButton>
            </div>

            {/* Error State */}
            <div className="border border-[#E2E8F0] rounded-md p-5 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Inline Form Error</h3>
              <PrototypeInput
                label="Promo Code"
                value="EXPIRED2025"
                error="Invalid or expired promo code"
              />
            </div>

          </div>
        </section>

      </div>

      {/* SAMPLE MODAL */}
      <PrototypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="DESIGN.md Verification Modal"
        footer={(
          <PrototypeButton variant="primary" size="sm" onClick={() => setModalOpen(false)}>
            Understood
          </PrototypeButton>
        )}
      >
        <p>This modal dialog adheres strictly to Section 25 of DESIGN.md:</p>
        <ul className="list-disc pl-4 space-y-1 text-xs">
          <li>Overlay: fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs</li>
          <li>Container: bg-white rounded-md border border-[#E2E8F0] shadow-xl</li>
          <li>Title: 18px SemiBold with close button icon</li>
        </ul>
      </PrototypeModal>

    </div>
  );
};

export default DesignSystemShowcase;
