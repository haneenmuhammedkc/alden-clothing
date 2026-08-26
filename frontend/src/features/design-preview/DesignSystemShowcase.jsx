import React, { useState } from 'react';
import PreviewButton from './components/PreviewButton';
import PreviewBadge from './components/PreviewBadge';
import PreviewInput, { PreviewSelect, PreviewQuantitySelector } from './components/PreviewInput';
import PreviewProductCard from './components/PreviewProductCard';
import PreviewCategoryItem from './components/PreviewCategoryItem';
import PreviewSectionHeading from './components/PreviewSectionHeading';
import PreviewModal from './components/PreviewModal';
import { TOKENS, MOCK_NEW_ARRIVALS, MOCK_CATEGORIES_8 } from './data/previewData';

export const DesignSystemShowcase = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [qty, setQty] = useState(2);

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans py-10 px-4 md:px-8 space-y-16">
      <div className="max-w-[1320px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="border-b border-[#DED4CB] pb-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
            ALDEN CLOTHING — DESIGN SYSTEM
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#30251F]">
            Timeless Editorial Luxury Showcase
          </h1>
          <p className="text-sm text-[#76675D] max-w-2xl leading-relaxed">
            Centralized design tokens and reusable component specification as defined in <code className="bg-[#FBF9F6] px-2 py-0.5 rounded border border-[#DED4CB]">DESIGN.md</code>.
          </p>
        </div>

        {/* 1. COLOR PALETTE SWATCHES */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            1. Color System Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Primary Background (Cream)", hex: "#F5EFE8", usage: "Main Page Canvas" },
              { name: "Secondary Surface (Cream)", hex: "#FBF9F6", usage: "Product Cards & Forms" },
              { name: "Warm Beige", hex: "#D8C4B4", usage: "Editorial Campaign Blocks" },
              { name: "Taupe Accent", hex: "#B7A08D", usage: "Borders & Image Overlays" },
              { name: "Cocoa Brown (Primary Accent)", hex: "#8B634B", usage: "Primary CTAs & Active States" },
              { name: "Deep Espresso (Primary Text)", hex: "#30251F", usage: "Headings, Navigation & Body" },
              { name: "Muted Brown (Secondary Text)", hex: "#76675D", usage: "Metadata & Subtitles" },
              { name: "Border Default", hex: "#DED4CB", usage: "1px Structural Rules" }
            ].map((col, idx) => (
              <div key={idx} className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[8px] overflow-hidden p-3 space-y-2">
                <div className="h-20 rounded-[6px] border border-black/10" style={{ backgroundColor: col.hex }} />
                <div>
                  <h4 className="text-xs font-bold text-[#30251F]">{col.name}</h4>
                  <p className="text-[11px] font-mono text-[#8B634B]">{col.hex}</p>
                  <p className="text-[11px] text-[#76675D]">{col.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. TYPOGRAPHY SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            2. Dual-Font Typography System (Cormorant Garamond + Montserrat)
          </h2>
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 lg:p-8 space-y-6">
            <div>
              <span className="text-xs text-[#8B634B] font-bold uppercase tracking-wider block">Editorial Display — Cormorant Garamond (20% Usage)</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#30251F] mt-1">
                TIMELESS PIECES FOR MODERN LIVING
              </h1>
            </div>
            <div className="border-t border-[#DED4CB] pt-4">
              <span className="text-xs text-[#8B634B] font-bold uppercase tracking-wider block">Primary UI Typography — Montserrat (80% Usage)</span>
              <p className="text-sm text-[#30251F] font-sans font-medium mt-1">
                Navigation links, buttons, product pricing tags, form field labels, metadata descriptors, and primary catalog interface components.
              </p>
            </div>
          </div>
        </section>

        {/* 3. BUTTON SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            3. Button System
          </h2>
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 flex flex-wrap items-center gap-4">
            <PreviewButton variant="primary">Primary Cocoa CTA</PreviewButton>
            <PreviewButton variant="secondary">Secondary Warm Beige</PreviewButton>
            <PreviewButton variant="outline">Outline Espresso</PreviewButton>
            <PreviewButton variant="ghost">Ghost Muted</PreviewButton>
            <PreviewButton variant="danger">Danger Red</PreviewButton>
          </div>
        </section>

        {/* 4. INPUTS & FORM CONTROLS */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            4. Form Controls & Inputs
          </h2>
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <PreviewInput label="Email Input" placeholder="Enter your email" />
            <PreviewSelect label="Size Selection" options={["Small (S)", "Medium (M)", "Large (L)"]} />
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#76675D] block">Quantity Selector</span>
              <PreviewQuantitySelector value={qty} onChange={setQty} />
            </div>
          </div>
        </section>

        {/* 5. BADGES */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            5. Restrained Semantic Badges
          </h2>
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-6 flex flex-wrap gap-3">
            <PreviewBadge status="active">Active Patron</PreviewBadge>
            <PreviewBadge status="new">New Drop</PreviewBadge>
            <PreviewBadge status="delivered">Delivered</PreviewBadge>
            <PreviewBadge status="processing">Processing</PreviewBadge>
            <PreviewBadge status="cancelled">Cancelled</PreviewBadge>
          </div>
        </section>

        {/* 6. PRODUCT CARD & CATEGORY ITEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            6. Product Card & Category Components
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PreviewProductCard product={MOCK_NEW_ARRIVALS[0]} />
            <PreviewCategoryItem category={MOCK_CATEGORIES_8[0]} />
          </div>
        </section>

        {/* 7. MODAL TEST */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#30251F] border-b border-[#DED4CB] pb-2">
            7. Modal Dialog Specification
          </h2>
          <div>
            <PreviewButton variant="outline" onClick={() => setModalOpen(true)}>
              Open Prototype Modal Dialog
            </PreviewButton>
            <PreviewModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Design System Prototype Modal"
              footer={
                <PreviewButton variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                  Close Showcase Modal
                </PreviewButton>
              }
            >
              <p>This modal container utilizes a 40% Deep Espresso backdrop with blur and an 8px radius cream dialog card.</p>
            </PreviewModal>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DesignSystemShowcase;
