import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';
import { useAuthStore } from './store/auth.store';
import { useEffect, useState } from 'react';

// Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Charities from './pages/public/Charities';
import Subscribe from './pages/public/Subscribe';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Winnings from './pages/user/Winnings';
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Winners from './pages/admin/Winners';
import Navbar from './components/layout/Navbar';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

export default function App() {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    fetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setUser]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/charities" element={<Charities />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/winnings" 
                element={
                  <ProtectedRoute>
                    <Winnings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/winners" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Winners />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
