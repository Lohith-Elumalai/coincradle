import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  dot = false,
  outline = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: {
      solid: 'bg-gray-100 text-gray-800',
      outline: 'bg-transparent text-gray-800 border border-gray-300'
    },
    primary: {
      solid: 'bg-blue-100 text-blue-800',
      outline: 'bg-transparent text-blue-800 border border-blue-300'
    },
    secondary: {
      solid: 'bg-purple-100 text-purple-800',
      outline: 'bg-transparent text-purple-800 border border-purple-300'
    },
    success: {
      solid: 'bg-green-100 text-green-800',
      outline: 'bg-transparent text-green-800 border border-green-300'
    },
    danger: {
      solid: 'bg-red-100 text-red-800',
      outline: 'bg-transparent text-red-800 border border-red-300'
    },
    warning: {
      solid: 'bg-yellow-100 text-yellow-800',
      outline: 'bg-transparent text-yellow-800 border border-yellow-300'
    },
    info: {
      solid: 'bg-indigo-100 text-indigo-800',
      outline: 'bg-transparent text-indigo-800 border border-indigo-300'
    }
  };
  
  const sizeStyles = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };
  
  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-blue-400',
    secondary: 'bg-purple-400',
    success: 'bg-green-400',
    danger: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-indigo-400'
  };
  
  const style = outline 
    ? variantStyles[variant]?.outline || variantStyles.default.outline
    : variantStyles[variant]?.solid || variantStyles.default.solid;
  
  const sizeStyle = sizeStyles[size] || sizeStyles.md;
  
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${rounded ? 'rounded-full' : 'rounded'}
        ${style}
        ${sizeStyle}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span 
          className={`mr-1.5 h-2 w-2 rounded-full ${dotColors[variant] || dotColors.default}`}
        ></span>
      )}
      {children}
    </span>
  );
};

export default Badge;