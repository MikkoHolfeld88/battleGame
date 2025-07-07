import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { store } from './store/store';
import App from './App';
import './index.css';
import './i18n'; // Import i18n configuration
import { CircularProgress, Box } from '@mui/material'; // For loading indicator

// Basic loading fallback component
const loadingMarkup = (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* Provider can be inside or outside Suspense, usually outside is fine */}
      <Suspense fallback={loadingMarkup}>
        <BrowserRouter> {/* Wrap App with BrowserRouter */}
          <App />
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
