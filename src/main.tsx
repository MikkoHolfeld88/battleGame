import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';
import { AuthProvider } from './auth/AuthContext'; // Import AuthProvider
import './index.css';
import './i18n'; // Import i18n configuration
import { CircularProgress, Box } from '@mui/material'; // For loading indicator

// Basic loading fallback component for main suspense
const mainLoadingMarkup = (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
    <p style={{ marginLeft: '10px' }}>Loading application...</p>
  </Box>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* BrowserRouter should ideally wrap AuthProvider if AuthProvider uses routing hooks, but it doesn't directly */}
        <AuthProvider> {/* AuthProvider wraps App to provide auth context */}
          <Suspense fallback={mainLoadingMarkup}> {/* Suspense for App's lazy loaded components */}
            <App />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
