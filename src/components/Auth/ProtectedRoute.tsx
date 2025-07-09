import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { LOGIN_PATH, HOME_PATH } from '../../routes'; // Assuming routes.ts is in src
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  redirectTo?: string; // Where to redirect if not authenticated (defaults to LOGIN_PATH)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo = LOGIN_PATH }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while auth state is being determined
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <p style={{ marginLeft: '10px' }}>Verifying authentication...</p>
      </Box>
    );
  }

  if (!isLoggedIn) {
    // User not logged in, redirect to login page
    // Pass the current location to redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User is logged in, render the child route element
  return <Outlet />;
};

/*
  A component to handle redirection for already logged-in users
  trying to access public-only pages like login/register.
*/
interface PublicRouteProps {
  redirectTo?: string; // Where to redirect if authenticated (defaults to HOME_PATH)
}

export const PublicOnlyRoute: React.FC<PublicRouteProps> = ({ redirectTo = HOME_PATH }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isLoggedIn) {
    // User is logged in, redirect away from public-only page (e.g., login page)
    return <Navigate to={redirectTo} replace />;
  }

  // User is not logged in, render the child route element (e.g., login page)
  return <Outlet />;
};

export default ProtectedRoute;
