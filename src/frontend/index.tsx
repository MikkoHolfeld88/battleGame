import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/global.css'; // We'll create this for basic styling

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element. The React app can't be mounted.");
}
