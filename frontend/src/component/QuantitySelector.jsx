import React from 'react'

/**
 * Reusable QuantitySelector component for Alden Clothing (DESIGN.md Timeless Editorial Luxury)
 * Restrained rectangular control (40px–44px height). Background: #FBF9F6. Border: #DED4CB. Text: #30251F.
 */
export const QuantitySelector = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className = ''
}) => {
  const handleDecrement = () => {
    if (value > min && onChange && !disabled) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max && onChange && !disabled) {
      onChange(value + 1)
    }
  }

  return (
    <div className={`inline-flex items-center border border-[#DED4CB] rounded-[4px] bg-[#FBF9F6] h-10 font-sans ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="w-10 h-full flex items-center justify-center text-[#30251F] hover:bg-[#F5EFE8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <span className="text-base font-semibold">-</span>
      </button>
      <span className="w-10 text-center text-xs font-bold text-[#30251F] select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="w-10 h-full flex items-center justify-center text-[#30251F] hover:bg-[#F5EFE8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <span className="text-base font-semibold">+</span>
      </button>
    </div>
  )
}

export default QuantitySelector
