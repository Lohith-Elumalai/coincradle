import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
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
    </div>
  );
};

export default NotFound;