// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading FinanceAI...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <FinanceDataProvider>
            <Router>
              <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />
                <div className="flex flex-1">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <div className="flex flex-1">
                            <Sidebar />
                            <div className="flex-1 p-4">
                              <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/budget" element={<Budget />} />
                                <Route path="/investments" element={<Investments />} />
                                <Route path="/debt" element={<DebtManagement />} />
                                <Route path="/planning" element={<FinancialPlanning />} />
                                <Route path="/chat" element={<AIChat />} />
                                <Route path="/connect-bank" element={<ConnectBank />} />
                                <Route path="/settings" element={<Settings />} />
                              </Routes>
                            </div>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </FinanceDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
