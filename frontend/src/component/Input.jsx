import React from 'react'

/**
 * Reusable Input component for Alden Clothing (DESIGN.md Timeless Editorial Luxury)
 * Height: 44px–48px. Background: #FBF9F6. Border: #DED4CB. Radius: 4px. Focus: #8B634B.
 */
export const Input = ({
  label,
  error,
  helperText,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={`flex flex-col space-y-1.5 font-sans ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#76675D]">
          {label} {required && <span className="text-[#8C2727]">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`h-11 px-3.5 bg-[#FBF9F6] text-sm text-[#30251F] placeholder-[#76675D]/60 border rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B634B]/20 focus:border-[#8B634B] disabled:bg-[#F5EFE8] disabled:cursor-not-allowed ${
          error ? 'border-[#8C2727] text-[#8C2727]' : 'border-[#DED4CB]'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-[#8C2727] font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-[#76675D]">{helperText}</span>}
    </div>
  )
}

export default Input
