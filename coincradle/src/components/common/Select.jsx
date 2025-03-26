import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  disabled = false,
  required = false,
  error,
  helperText,
  placeholder,
  className = '',
  selectClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  fullWidth = false,
  ...props
}, ref) => {
  // Generate an id if none is provided
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`
          block rounded-md shadow-sm 
          ${fullWidth ? 'w-full' : ''}
          ${error 
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          ${selectClassName}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className={`mt-1 text-xs text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={`mt-1 text-xs text-gray-500 ${helperClassName}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;