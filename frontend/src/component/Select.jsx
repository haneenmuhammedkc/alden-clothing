import React from 'react'

/**
 * Reusable Select component for Alden Clothing (DESIGN.md Timeless Editorial Luxury)
 * Height: 44px–48px. Background: #FBF9F6. Border: #DED4CB. Radius: 4px. Font: Montserrat.
 */
export const Select = ({
  label,
  error,
  options = [],
  value,
  onChange,
  name,
  id,
  className = '',
  required = false,
  disabled = false,
  children,
  ...props
}) => {
  const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={`flex flex-col space-y-1.5 font-sans ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-[#76675D]">
          {label} {required && <span className="text-[#8C2727]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`h-11 w-full px-3.5 pr-10 bg-[#FBF9F6] text-sm text-[#30251F] border rounded-[4px] appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B634B]/20 focus:border-[#8B634B] cursor-pointer disabled:bg-[#F5EFE8] disabled:cursor-not-allowed ${
            error ? 'border-[#8C2727]' : 'border-[#DED4CB]'
          }`}
          {...props}
        >
          {children ? children : options.map((opt, idx) => (
            <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#76675D]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-[#8C2727] font-medium">{error}</span>}
    </div>
  )
}

export default Select
