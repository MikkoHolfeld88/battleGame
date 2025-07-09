import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './App.css';

import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;
