import React from 'react';

/**
 * Modal System matching DESIGN.md Section 25.
 * Features dark slate backdrop overlay, 6px border radius, crisp border, and clean header.
 */
export const PrototypeModal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-lg w-full p-6 z-10 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
          <h3 className="text-lg font-semibold text-[#0F172A] tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="text-sm text-[#475569] space-y-4">
          {children}
        </div>

        {/* Footer Actions (Optional) */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrototypeModal;
