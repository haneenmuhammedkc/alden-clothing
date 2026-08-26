import React from 'react'

/**
 * Reusable Button component for Alden Clothing (DESIGN.md Timeless Editorial Luxury)
 * Palette: Cocoa Brown (#8B634B), Deep Espresso (#30251F), Warm Beige (#D8C4B4)
 * Scoped Radius: 8px (rounded-md). No rounded-full pills.
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#8B634B] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] cursor-pointer"

  const sizeStyles = {
    sm: "h-9 px-4 text-[11px]",
    md: "h-11 px-6 text-xs",
    lg: "h-12 px-8 text-xs"
  }

  const variantStyles = {
    primary: "bg-[#8B634B] text-white hover:bg-[#30251F] active:bg-[#251C17] shadow-xs",
    secondary: "bg-[#D8C4B4] text-[#30251F] hover:bg-[#B7A08D]",
    outline: "bg-transparent text-[#30251F] border border-[#30251F] hover:bg-[#30251F] hover:text-white",
    ghost: "bg-transparent text-[#76675D] hover:bg-[#FBF9F6] hover:text-[#30251F]",
    danger: "bg-[#8C2727] text-white hover:bg-[#681C1C]"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
