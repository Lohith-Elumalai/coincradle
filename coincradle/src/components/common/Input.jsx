import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  id,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  disabled = false,
  readOnly = false,
  required = false,
  autoComplete,
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  prefix,
  suffix,
  fullWidth = false,
  startAdornment,
  endAdornment,
  ...props
}, ref) => {
  // Generate an id if none is provided
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {startAdornment}
          </div>
        )}
        
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          className={`
            block rounded-md shadow-sm 
            ${fullWidth ? 'w-full' : ''}
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-7' : ''}
            ${startAdornment ? 'pl-10' : ''}
            ${endAdornment ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
        
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>
      
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

Input.displayName = 'Input';

export default Input;