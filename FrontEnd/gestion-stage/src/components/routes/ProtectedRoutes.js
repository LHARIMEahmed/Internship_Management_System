// src/components/routes/ProtectedRoutes.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth"

// Route that requires authentication
export const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
  
  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

// Route that requires specific role
export const RoleRoute = ({ requiredRole }) => {
  const { currentUser, loading, hasRole } = useAuth();
  
  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated and has required role
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Redirect to unauthorized page if user doesn't have required role
  return hasRole(requiredRole) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

// Route that is only accessible for non-authenticated users (like login page)
export const PublicOnlyRoute = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }
  
  // Redirect to home if already authenticated
  return currentUser ? <Navigate to="/" /> : <Outlet />;
};