import React from 'react'

/**
 * Reusable SectionHeading component for Alden Clothing (DESIGN.md Timeless Editorial Luxury)
 * Eyebrow: Montserrat uppercase tracking. Title: Cormorant Garamond serif display. Description: Montserrat.
 */
export const SectionHeading = ({ 
  eyebrow, 
  title, 
  description,
  subtitle, 
  align = 'center',
  useSerif = true,
  className = ''
}) => {
  const subText = description || subtitle

  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  }

  return (
    <div className={`flex flex-col space-y-2 max-w-2xl ${alignStyles[align] || alignStyles.center} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B634B]">
          {eyebrow}
        </span>
      )}

      {title && (
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#30251F] leading-tight ${
          useSerif ? 'font-serif font-normal' : 'font-sans font-bold'
        }`}>
          {title}
        </h2>
      )}

      {subText && (
        <p className="text-sm sm:text-base text-[#76675D] font-normal leading-relaxed">
          {subText}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
