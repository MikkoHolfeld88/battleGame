import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import './App.css';

// Import Page Components
import LandingPage from './pages/LandingPage/LandingPage';
import GameStartPage from './pages/GameStartPage/GameStartPage';
import GameContainerPage from './pages/GameContainerPage/GameContainerPage';
import LoginPage from './pages/LoginPage/LoginPage';

// Import Global UI Components
import GlobalSnackbar from './components/UI/GlobalSnackbar';

// Import Route Paths
import {
  LANDING_PATH, HOME_PATH, GAME_START_PATH, GAME_CONTAINER_PATH, LOGIN_PATH,
  BLOG_PHASE1_PATH, BLOG_POST_PATH, BLOG_BASE_PATH
} from './routes';

// Import ProtectedRoute and PublicOnlyRoute
import ProtectedRoute, { PublicOnlyRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalSnackbar />
      <Routes>
        {/* Public Routes */}
        {/* LandingPage handles its own content based on path, including blog posts */}
        <Route path={LANDING_PATH} element={<LandingPage />} />
        <Route path={BLOG_BASE_PATH + "/*"} element={<LandingPage />} /> {/* Ensures LandingPage is rendered for /blog/* routes */}


        {/* PublicOnlyRoute: For pages like login, if user is logged in, redirect to GAME_START_PATH (via HOME_PATH alias) */}
        <Route element={<PublicOnlyRoute redirectTo={HOME_PATH} />}>
          <Route path={LOGIN_PATH} element={<LoginPage />} />
        </Route>

        {/* Protected Routes: Routes that require authentication */}
        <Route element={<ProtectedRoute redirectTo={LOGIN_PATH} />}>
          {/* GAME_START_PATH is now the canonical path for GameStartPage */}
          <Route path={GAME_START_PATH} element={<GameStartPage />} />
          {/* The conditional redirect for GAME_START_PATH !== HOME_PATH is no longer needed as they are the same. */}

          <Route path={GAME_CONTAINER_PATH} element={<GameContainerPage />} />
        </Route>

        {/* Fallback for any other undefined routes */}
        <Route path="*" element={<Navigate to={LANDING_PATH} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
