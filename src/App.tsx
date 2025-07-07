import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import './App.css';

// Import Page Components
import LandingPage from './pages/LandingPage/LandingPage';
import GameStartPage from './pages/GameStartPage/GameStartPage';
import GameContainerPage from './pages/GameContainerPage/GameContainerPage';

// Import Route Paths
import { LANDING_PATH, HOME_PATH, GAME_START_PATH, GAME_CONTAINER_PATH, LOGIN_PATH } from './routes';

// Placeholder for Login Page - assuming it would redirect to HOME_PATH upon successful login
// For now, we can add a simple component or just a route that might be developed later.
const LoginPagePlaceholder = () => (
  <div>
    <h1>Login Page (Placeholder)</h1>
    <p>Normally, you'd log in here. For now, navigate to <a href={HOME_PATH}>Game Start</a> directly (if not redirected automatically).</p>
  </div>
);


// A simple component that simulates login and redirects.
// In a real app, this would involve authentication logic.
// For now, we can simulate that a user is "logged in" by directly accessing /home
// or by having a button on LandingPage navigate to HOME_PATH.
// Let's assume for now that HOME_PATH is the designated post-login area.

function App() {
  // const isAuthenticated = true; // Replace with actual auth state logic

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Router now wraps the entire application */}
      {/* Note: <BrowserRouter> should be in main.tsx for cleaner separation */}
      {/* However, the plan has a separate step for main.tsx, so we'll do it there. */}
      {/* For this step, we focus on Routes within App.tsx */}
      <Routes>
        <Route path={LANDING_PATH} element={<LandingPage />} />
        <Route path={LOGIN_PATH} element={<LoginPagePlaceholder />} />

        {/* This will be the main page after "login" */}
        <Route path={HOME_PATH} element={<GameStartPage />} />

        {/* If GAME_START_PATH is meant as an alias or an alternative entry, redirect or use it */}
        {/* For simplicity, let's assume HOME_PATH is the canonical route for GameStartPage */}
        {GAME_START_PATH !== HOME_PATH && (
          <Route path={GAME_START_PATH} element={<Navigate to={HOME_PATH} replace />} />
        )}

        <Route path={GAME_CONTAINER_PATH} element={<GameContainerPage />} />

        {/* Fallback for any other undefined routes */}
        <Route path="*" element={<Navigate to={LANDING_PATH} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
