<<<<<<< HEAD
import React from 'react';
=======
<<<<<<< HEAD
// src/pages/NotFound.jsx
import React from 'react';
=======
>>>>>>> 4404e68ff82ae876e615fd84634bb867448f2e6f
>>>>>>> 3e5350dc878856366081bc3595ecfd1fb90a1a80
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 3e5350dc878856366081bc3595ecfd1fb90a1a80
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-16 w-16 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
<<<<<<< HEAD
=======
=======
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Dashboard
      </Link>
>>>>>>> 4404e68ff82ae876e615fd84634bb867448f2e6f
>>>>>>> 3e5350dc878856366081bc3595ecfd1fb90a1a80
    </div>
  );
};

export default NotFound;