import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Define dashboard paths based on user role, not name
  const dashboardPaths = {
    user: '/portfolio',
    admin: '/admin', // Add admin path if needed
    // Add other roles as needed
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        console.log('Current user data:', userData);
        setUser(userData);

        // Redirect authenticated users away from login page
        if (userData && location.pathname === '/login') {
          // Use role instead of name for navigation
          const userRole = userData.user?.role || userData.role || 'user';
          navigate(dashboardPaths[userRole] || '/portfolio');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        // Only redirect to login if user is on a protected route
        const publicRoutes = ['/login', '/signup', '/register', '/forgot-password', '/'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      setUser(response);
      
      // Determine user role from response
      const userRole = response.user?.role || response.role || 'user';
      const userName = response.user?.name || response.name || 'User';
      
      // Navigate to appropriate dashboard
      navigate(dashboardPaths[userRole] || '/portfolio');
      toast.success(`Welcome, ${userName}!`);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      console.log(user)
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      navigate('/login');
      toast.error('Logout failed, but you have been logged out locally.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};