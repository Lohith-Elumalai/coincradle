import React, { forwardRef } from 'react';

/**
 * Label component for form elements
 * 
 * @param {Object} props - Component props
 * @param {string} props.htmlFor - The ID of the form control this label is for
 * @param {React.ReactNode} props.children - The label text or nested elements
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the associated form field is required
 * @param {boolean} props.disabled - Whether the label should appear disabled
 */
const Label = forwardRef(({
  htmlFor,
  children,
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`
        text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
        peer-disabled:opacity-70 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = 'Label';

export { Label };

// For compatibility with different import styles
export default Label;