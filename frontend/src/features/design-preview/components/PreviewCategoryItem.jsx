import React from 'react';

export const PreviewCategoryItem = ({ category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center text-center space-y-3 font-sans"
    >
      {/* Floating Neutral Apparel Image Area (Aspect 3:4 or 4:5 Portrait) */}
      <div className="w-full aspect-[3/4] bg-[#F5EFE8] rounded-[10px] overflow-hidden relative shadow-xs transition-transform duration-200 group-hover:scale-[1.02] flex items-center justify-center">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-95"
          loading="lazy"
        />
      </div>

      {/* Bold Category Name & Description */}
      <div className="space-y-0.5 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] group-hover:text-[#8B634B] transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-[11px] text-[#76675D] line-clamp-1">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewCategoryItem;
