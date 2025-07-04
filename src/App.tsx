import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './App.css';

// Import LandingPage
import LandingPage from './pages/LandingPage/LandingPage';

// If more pages are added later, React Router would be set up here.
// For now, directly rendering LandingPage.
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*
        If using React Router:
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            // Other routes for the game, etc.
          </Routes>
        </Router>
      */}
      {/* For a single page app or if LandingPage is the main entry point: */}
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;
