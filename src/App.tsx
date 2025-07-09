import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import './App.css';

// Import Page Components
import LandingPage from './pages/LandingPage/LandingPage';
import GameStartPage from './pages/GameStartPage/GameStartPage';
import GameContainerPage from './pages/GameContainerPage/GameContainerPage';
import LoginPage from './pages/LoginPage/LoginPage'; // Import the actual LoginPage

// Import Global UI Components
import GlobalSnackbar from './components/UI/GlobalSnackbar'; // Import GlobalSnackbar

// Import Route Paths
import { LANDING_PATH, HOME_PATH, GAME_START_PATH, GAME_CONTAINER_PATH, LOGIN_PATH } from './routes';

// Import ProtectedRoute and PublicOnlyRoute
import ProtectedRoute, { PublicOnlyRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalSnackbar /> {/* Add GlobalSnackbar here */}
      <Routes>
        {/* Public Routes */}
        <Route path={LANDING_PATH} element={<LandingPage />} />

        {/* PublicOnlyRoute: For pages like login, if user is logged in, redirect to HOME_PATH */}
        <Route element={<PublicOnlyRoute redirectTo={HOME_PATH} />}>
          <Route path={LOGIN_PATH} element={<LoginPage />} />
        </Route>

        {/* Protected Routes: Routes that require authentication */}
        <Route element={<ProtectedRoute redirectTo={LOGIN_PATH} />}>
          {/* This will be the main page after "login" */}
          <Route path={HOME_PATH} element={<GameStartPage />} />

          {/* If GAME_START_PATH is meant as an alias or an alternative entry, redirect or use it */}
          {/* For simplicity, let's assume HOME_PATH is the canonical route for GameStartPage */}
          {GAME_START_PATH !== HOME_PATH && (
            <Route path={GAME_START_PATH} element={<Navigate to={HOME_PATH} replace />} />
          )}

          <Route path={GAME_CONTAINER_PATH} element={<GameContainerPage />} />
        </Route>

        {/* Fallback for any other undefined routes */}
        {/* Consider where to redirect unauthenticated users for undefined routes */}
        {/* For now, redirecting to LANDING_PATH. If user is logged in, they might expect HOME_PATH. */}
        <Route path="*" element={<Navigate to={LANDING_PATH} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
