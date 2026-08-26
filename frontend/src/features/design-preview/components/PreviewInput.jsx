import React from 'react';

export const PreviewInput = ({
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
    <div className={`flex flex-col space-y-1.5 font-sans ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#76675D]">
          {label} {required && <span className="text-[#8C2727]">*</span>}
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
        className={`h-11 px-3.5 bg-[#FBF9F6] text-sm text-[#30251F] placeholder-[#76675D]/60 border rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B634B]/20 focus:border-[#8B634B] disabled:bg-[#F5EFE8] disabled:cursor-not-allowed ${
          error ? 'border-[#8C2727] text-[#8C2727]' : 'border-[#DED4CB]'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-[#8C2727] font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-[#76675D]">{helperText}</span>}
    </div>
  );
};

export const PreviewSelect = ({
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
    <div className={`flex flex-col space-y-1.5 font-sans ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[#76675D]">
          {label} {required && <span className="text-[#8C2727]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={`h-11 w-full px-3.5 pr-10 bg-[#FBF9F6] text-sm text-[#30251F] border rounded-[4px] appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B634B]/20 focus:border-[#8B634B] cursor-pointer ${
            error ? 'border-[#8C2727]' : 'border-[#DED4CB]'
          }`}
          {...props}
        >
          {options.map((opt, idx) => (
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
  );
};

export const PreviewQuantitySelector = ({ value = 1, onChange, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (value > min && onChange) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max && onChange) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center border border-[#DED4CB] rounded-[4px] bg-[#FBF9F6] h-9 font-sans">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-9 h-full flex items-center justify-center text-[#30251F] hover:bg-[#F5EFE8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
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
        disabled={value >= max}
        className="w-9 h-full flex items-center justify-center text-[#30251F] hover:bg-[#F5EFE8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Increase quantity"
      >
        <span className="text-base font-semibold">+</span>
      </button>
    </div>
  );
};

export default PreviewInput;
