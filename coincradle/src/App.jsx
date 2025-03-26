// src/App.jsx
import { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceDataProvider } from './contexts/FinanceDataContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Investments from './pages/Investments';
import DebtManagement from './pages/DebtManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import AIChat from './pages/AIChat';
import FinancialPlanning from './pages/FinancialPlanning';
import ConnectBank from './pages/ConnectBank';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 flex-col p-6">
      <h2 className="text-red-600 text-xl font-bold mb-4">Something went wrong:</h2>
      <pre className="bg-red-50 p-4 rounded overflow-auto max-w-full text-sm">
        {error.message}
        {error.stack && (
          <div className="mt-2 pt-2 border-t border-red-200">
            <details>
              <summary className="cursor-pointer font-medium">Stack Trace</summary>
              <div className="mt-2 whitespace-pre-wrap">
                {error.stack}
              </div>
            </details>
          </div>
        )}
      </pre>
      <div className="mt-6 flex space-x-4">
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Loading Component
function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading FinanceAI...</p>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  useEffect(() => {
    // Simulate initial loading - reduce timeout to test faster
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle global errors
  const handleError = (error, info) => {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", info.componentStack);
    // You could also log to an error reporting service here
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback} 
      onError={handleError}
      onReset={() => {
        // Reset the state of your app here
        console.log("Resetting error boundary state");
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingScreen />}>
          <ThemeProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <AuthProvider>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <FinanceDataProvider>
                    <Router>
                      <div className="flex min-h-screen flex-col bg-gray-50">
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <Navbar />
                        </ErrorBoundary>
                        <div className="flex flex-1">
                          <Routes>
                            <Route path="/login" element={
                              <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Login />
                              </ErrorBoundary>
                            } />
                            <Route path="/register" element={
                              <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Register />
                              </ErrorBoundary>
                            } />
                            <Route
                              path="/*"
                              element={
                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                  <ProtectedRoute>
                                    <div className="flex flex-1">
                                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                                        <Sidebar />
                                      </ErrorBoundary>
                                      <div className="flex-1 p-4">
                                        <Routes>
                                          <Route path="/" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <Dashboard />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/budget" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <Budget />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/investments" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <Investments />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/debt" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <DebtManagement />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/planning" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <FinancialPlanning />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/chat" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <AIChat />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/connect-bank" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <ConnectBank />
                                            </ErrorBoundary>
                                          } />
                                          <Route path="/settings" element={
                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                              <Settings />
                                            </ErrorBoundary>
                                          } />
                                        </Routes>
                                      </div>
                                    </div>
                                  </ProtectedRoute>
                                </ErrorBoundary>
                              }
                            />
                          </Routes>
                        </div>
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <Footer />
                        </ErrorBoundary>
                      </div>
                    </Router>
                  </FinanceDataProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;