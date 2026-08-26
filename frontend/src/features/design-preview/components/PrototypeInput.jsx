import React from 'react';

/**
 * Text & Password Input matching DESIGN.md Section 10.
 * Height: 44px, Bg: #FFFFFF, Border: 1px #CBD5E1, Radius: 4px (rounded-sm), Focus ring: #00412E
 */
export const PrototypeInput = ({
  label,
  error,
  helperText,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
          {label} {required && <span className="text-[#991B1B]">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`h-11 px-3.5 bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] border rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00412E]/20 focus:border-[#00412E] disabled:bg-[#F8FAFC] disabled:cursor-not-allowed ${
          error ? 'border-[#DC2626] text-[#991B1B]' : 'border-[#CBD5E1]'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-[#991B1B] font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-[#94A3B8]">{helperText}</span>}
    </div>
  );
};

/**
 * Custom Select matching DESIGN.md
 */
export const PrototypeSelect = ({
  label,
  error,
  options = [],
  value,
  onChange,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
          {label} {required && <span className="text-[#991B1B]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={`h-11 w-full px-3.5 pr-10 bg-white text-sm text-[#0F172A] border rounded-[4px] appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#00412E]/20 focus:border-[#00412E] cursor-pointer ${
            error ? 'border-[#DC2626]' : 'border-[#CBD5E1]'
          }`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-[#991B1B] font-medium">{error}</span>}
    </div>
  );
};

/**
 * Quantity Selector matching DESIGN.md Section 10
 * 36px height inline flex container with - button, center count text, + button.
 */
export const PrototypeQuantitySelector = ({ value = 1, onChange, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (value > min && onChange) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max && onChange) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center border border-[#CBD5E1] rounded-[4px] bg-white h-9">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-9 h-full flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-30 disabled:hover:bg-white transition-colors"
        aria-label="Decrease quantity"
      >
        <span className="text-base font-semibold">-</span>
      </button>
      <span className="w-10 text-center text-xs font-bold text-[#0F172A] select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-9 h-full flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-30 disabled:hover:bg-white transition-colors"
        aria-label="Increase quantity"
      >
        <span className="text-base font-semibold">+</span>
      </button>
    </div>
  );
};
