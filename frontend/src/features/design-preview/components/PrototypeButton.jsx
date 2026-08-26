import React from 'react';

/**
 * Reusable prototype buttons according to DESIGN.md section 9.
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 */
export const PrototypeButton = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  let baseStyle = "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00412E] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs tracking-wider",
    md: "h-11 px-5 text-sm tracking-wide",
    lg: "h-12 px-7 text-base tracking-wide"
  };

  const variantStyles = {
    primary: "bg-[#00412E] text-white hover:bg-[#002B1F] active:bg-[#001A13] shadow-xs",
    secondary: "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#E2E8F0]",
    outline: "bg-transparent text-[#0F172A] border border-[#0F172A] hover:bg-[#0F172A] hover:text-white",
    ghost: "bg-transparent text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default PrototypeButton;
