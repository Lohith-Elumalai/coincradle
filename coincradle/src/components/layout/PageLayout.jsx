import React from 'react';
import PropTypes from 'prop-types';

/**
 * PageLayout component for consistent page structure
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {React.ReactNode} props.actions - Optional action buttons for the header
 * @param {boolean} props.loading - Loading state
 */
const PageLayout = ({ 
  children, 
  title, 
  description, 
  actions, 
  loading = false 
}) => {
  return (
    <div className="h-full py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && (
            <p className="mt-1 text-gray-600">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-3">
            {actions}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="ml-3 text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        /* Page Content */
        <div className="space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  loading: PropTypes.bool
};

export default PageLayout;