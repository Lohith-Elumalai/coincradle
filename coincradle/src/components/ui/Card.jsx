import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  shadow = 'md',
  border = true,
  padding = true,
  onClick
}) => {
  const shadowVariants = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden
        ${border ? 'border border-gray-200' : ''}
        ${shadowVariants[shadow] || shadowVariants.md}
        ${onClick ? 'cursor-pointer transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${padding ? 'px-6 py-4' : ''} ${headerClassName}`}>
          {title && (
            typeof title === 'string' 
              ? <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              : subtitle
          )}
        </div>
      )}
      
      <div className={`${padding ? 'p-6' : ''} ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`border-t border-gray-200 ${padding ? 'px-6 py-4' : ''} ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;