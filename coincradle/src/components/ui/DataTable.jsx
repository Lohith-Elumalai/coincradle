// src/components/ui/DataTable.jsx
import React, { useState } from 'react';

const DataTable = ({ 
  data, 
  columns, 
  pagination = true, 
  pageSize = 10,
  className = '',
  emptyMessage = 'No data available'
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1;
  const paginatedData = pagination 
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : data;

  // Change page handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  return (
    <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-sm font-medium text-gray-600"
                  style={{ width: column.width || 'auto' }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id || rowIndex}-${column.key}`}
                    className="px-4 py-3 text-sm text-gray-800"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`rounded px-3 py-1 text-sm ${
                currentPage === 1
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`rounded px-3 py-1 text-sm ${
                currentPage === totalPages
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
