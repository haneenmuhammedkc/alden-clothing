import React, { useState } from 'react';
import PreviewButton from '../components/PreviewButton';
import PreviewProductCard from '../components/PreviewProductCard';
import PreviewCategoryItem from '../components/PreviewCategoryItem';
import PreviewSectionHeading from '../components/PreviewSectionHeading';
import { 
  MOCK_HERO_SLIDES, 
  MOCK_CATEGORIES_8, 
  MOCK_PROMO_CAMPAIGN, 
  MOCK_NEW_ARRIVALS 
} from '../data/previewData';

export const HomePreview = ({ onNavigate }) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const heroSlide = MOCK_HERO_SLIDES[activeHeroIndex] || MOCK_HERO_SLIDES[0];

  return (
    <div className="bg-[#F5EFE8] text-[#30251F] min-h-screen font-sans selection:bg-[#8B634B] selection:text-white space-y-20 pb-16">
      
      {/* ================================================== */}
      {/* 1. EDITORIAL HERO SECTION (Asymmetrical Composition) */}
      {/* ================================================== */}
      <section className="px-4 md:px-8 pt-6">
        <div className="max-w-[1320px] mx-auto rounded-[32px] md:rounded-[48px] overflow-hidden bg-[#D8C4B4] border border-[#B7A08D]/40 p-8 lg:p-14 shadow-xs relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[460px] lg:min-h-[500px]">
            
            {/* HERO LEFT COPY (Editorial Serif Headline) */}
            <div className="lg:col-span-6 space-y-6 z-10">
              
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
                  {heroSlide.subtitle}
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#30251F] leading-[0.98]">
                  {heroSlide.headlineLine1}<br />
                  <span className="italic">{heroSlide.headlineLine2}</span>
                </h1>
              </div>

              <p className="text-sm sm:text-base text-[#76675D] font-normal leading-relaxed max-w-md">
                {heroSlide.description}
              </p>

              <div className="pt-3">
                <PreviewButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => onNavigate && onNavigate(heroSlide.ctaLink)}
                >
                  {heroSlide.ctaText}
                </PreviewButton>
              </div>

            </div>

            {/* HERO RIGHT ASYMMETRICAL EDITORIAL PHOTOGRAPHY */}
            <div className="lg:col-span-6 h-[340px] lg:h-[480px] relative flex justify-center lg:justify-end">
              <div className="w-full h-full rounded-[24px] lg:rounded-[40px] overflow-hidden bg-[#B7A08D] shadow-sm relative">
                <img
                  src={heroSlide.imageMain}
                  alt="Alden Clothing Editorial Campaign"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 2. SHOP BY CATEGORY (8 Categories, 4x2 Grid) */}
      {/* ================================================== */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8">
        
        <PreviewSectionHeading
          title="SHOP BY CATEGORY"
          subtitle="Limited drop. Maximum impact."
          align="center"
          useSerif={false}
          className="mb-12"
        />

        {/* 4 Columns x 2 Rows Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {MOCK_CATEGORIES_8.map((cat) => (
            <PreviewCategoryItem
              key={cat.id}
              category={cat}
              onClick={() => onNavigate && onNavigate('listing')}
            />
          ))}
        </div>

      </section>

      {/* ================================================== */}
      {/* 3. PROMOTIONAL CAMPAIGN BANNER */}
      {/* ================================================== */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1320px] mx-auto rounded-[24px] lg:rounded-[32px] bg-[#D8C4B4] border border-[#B7A08D]/40 p-8 lg:p-14 shadow-xs relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Banner Copy */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
                {MOCK_PROMO_CAMPAIGN.subtitle}
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-[#30251F]">
                {MOCK_PROMO_CAMPAIGN.title}
              </h2>
              
              <p className="text-sm text-[#76675D] leading-relaxed max-w-lg">
                {MOCK_PROMO_CAMPAIGN.description}
              </p>

              <div className="pt-2">
                <PreviewButton
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate && onNavigate('listing')}
                >
                  {MOCK_PROMO_CAMPAIGN.ctaText}
                </PreviewButton>
              </div>
            </div>

            {/* Banner Campaign Image */}
            <div className="md:col-span-5 h-64 md:h-80 rounded-[20px] overflow-hidden bg-[#B7A08D]">
              <img
                src={MOCK_PROMO_CAMPAIGN.image}
                alt="Promotional Campaign"
                className="w-full h-full object-cover object-center"
              />
            </div>

          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 4. NEW ARRIVALS (4 Products Desktop Row) */}
      {/* ================================================== */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 space-y-12">
        
        <PreviewSectionHeading
          title="NEW ARRIVALS"
          subtitle="Fresh pieces for the season."
          align="center"
          useSerif={false}
        />

        {/* 4 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {MOCK_NEW_ARRIVALS.map((item) => (
            <PreviewProductCard
              key={item.id}
              product={item}
              onProductClick={() => onNavigate && onNavigate('details')}
            />
          ))}
        </div>

      </section>

      {/* ================================================== */}
      {/* 5. EDITORIAL BRAND STATEMENT */}
      {/* ================================================== */}
      <section className="py-16 px-4 md:px-8 border-y border-[#DED4CB]/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B634B]">
            ALDEN PHILOSOPHY
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#30251F] leading-tight">
            TIMELESS PIECES.<br />
            <span className="italic">MADE FOR MODERN LIVING.</span>
          </h2>
          <p className="text-sm text-[#76675D] max-w-xl mx-auto leading-relaxed pt-2">
            We prioritize organic textiles, relaxed tailoring, and enduring silhouettes crafted to remain sophisticated season after season.
          </p>
        </div>
      </section>

      {/* ================================================== */}
      {/* 6. NEWSLETTER SECTION (#30251F Dark Espresso) */}
      {/* ================================================== */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1320px] mx-auto bg-[#30251F] text-white rounded-[16px] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-white">
              STAY IN THE KNOW
            </h2>
            <p className="text-xs sm:text-sm text-[#D8C4B4] font-sans">
              Receive new collection updates, seasonal edits, and exclusive drops.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0 font-sans">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-12 px-4 bg-[#FBF9F6] border border-[#DED4CB] rounded-[6px] text-sm text-[#30251F] placeholder-[#76675D]/60 focus:outline-none focus:ring-2 focus:ring-[#8B634B] w-full sm:w-80"
            />
            <PreviewButton
              variant="primary"
              size="md"
              className="w-full sm:w-auto shrink-0"
              onClick={() => alert("Simulated Newsletter Subscription")}
            >
              SUBSCRIBE
            </PreviewButton>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePreview;
