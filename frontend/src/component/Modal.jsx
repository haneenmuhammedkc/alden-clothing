import React, { useEffect } from 'react'

/**
 * Reusable accessible Modal component for Alden Clothing (DESIGN.md Timeless Editorial Luxury)
 * Overlay: #30251F at 40% opacity. Dialog: #FBF9F6 with 8px radius and 1px #DED4CB border.
 */
export const Modal = ({ isOpen, open, onClose, title, children, footer, className = '' }) => {
  const isModalOpen = isOpen !== undefined ? isOpen : open

  // Keyboard accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen && onClose) {
        onClose()
      }
    }
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, onClose])

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-[#30251F]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`relative bg-[#FBF9F6] rounded-[8px] border border-[#DED4CB] shadow-xl max-w-lg w-full p-6 z-10 animate-fade-in-up ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DED4CB] mb-4">
          {title && (
            <h3 id="modal-title" className="text-lg font-bold text-[#30251F] tracking-tight">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#76675D] hover:bg-[#F5EFE8] hover:text-[#30251F] transition-colors cursor-pointer ml-auto"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="text-sm text-[#76675D] space-y-4">
          {children}
        </div>

        {/* Footer Actions */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-[#DED4CB] flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
