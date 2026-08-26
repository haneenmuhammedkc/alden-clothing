import React from 'react';

/**
 * PreviewBadge.jsx
 * Restrained semantic badges strictly adhering to DESIGN.md Section 2
 */
export const PreviewBadge = ({ status = 'active', text, children }) => {
  const labelText = text || children;

  const badgeStyles = {
    active: "bg-[#F5EFE8] text-[#8B634B] border border-[#B7A08D]",
    new: "bg-[#F5EFE8] text-[#8B634B] border border-[#B7A08D]",
    delivered: "bg-[#E8F2E6] text-[#2D5A27] border border-[#A5C69F]",
    shipped: "bg-[#E8F2E6] text-[#2D5A27] border border-[#A5C69F]",
    processing: "bg-[#FBEFE6] text-[#8C4A1B] border border-[#D8C4B4]",
    pending: "bg-[#FBEFE6] text-[#8C4A1B] border border-[#D8C4B4]",
    cancelled: "bg-[#FBE6E6] text-[#8C2727] border border-[#E0A8A8]",
    neutral: "bg-[#FBF9F6] text-[#76675D] border border-[#DED4CB]"
  };

  const selectedStyle = badgeStyles[status?.toLowerCase()] || badgeStyles.neutral;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-sans font-semibold uppercase tracking-wider ${selectedStyle}`}>
      {labelText}
    </span>
  );
};

export default PreviewBadge;
