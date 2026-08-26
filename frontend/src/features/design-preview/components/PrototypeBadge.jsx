import React from 'react';

/**
 * Restrained status badges aligned with DESIGN.md Section 26.
 * Statuses: active/new, sale, pending/processing, shipped/delivered, cancelled/blocked
 */
export const PrototypeBadge = ({ status = 'active', text, children }) => {
  const labelText = text || children;

  const badgeStyles = {
    // New / Active: Text #00412E, Bg #F0F5F2, Border #96BF8A
    active: "bg-[#F0F5F2] text-[#00412E] border border-[#96BF8A]",
    new: "bg-[#F0F5F2] text-[#00412E] border border-[#96BF8A]",
    
    // Sale: Text #991B1B, Bg #FEE2E2, Border #FCA5A5
    sale: "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]",
    
    // Pending / Processing: Text #9A3412, Bg #FFEDD5, Border #FDBA74
    pending: "bg-[#FFEDD5] text-[#9A3412] border border-[#FDBA74]",
    processing: "bg-[#FFEDD5] text-[#9A3412] border border-[#FDBA74]",
    
    // Shipped / Delivered: Text #166534, Bg #DCFCE7, Border #86EFAC
    delivered: "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]",
    shipped: "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]",
    
    // Cancelled / Blocked: Text #991B1B, Bg #FEE2E2, Border #FCA5A5
    cancelled: "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]",
    blocked: "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]",
    
    // Neutral default
    neutral: "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
  };

  const selectedStyle = badgeStyles[status?.toLowerCase()] || badgeStyles.neutral;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider ${selectedStyle}`}>
      {labelText}
    </span>
  );
};

export default PrototypeBadge;
