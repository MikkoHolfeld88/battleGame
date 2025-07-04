// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { store } from './store/store';
// import App from './App';
import './index.css'; // Global styles
// import './landing-page.css'; // Already linked in index.html
// import './landing-page.ts'; // Already linked as a module script in index.html

// The existing React app setup is below.
// For the static landing page (index.html), we don't need to render a React app into #root
// unless the landing page itself is supposed to be a React component.
// Based on the current plan, index.html is a static page with vanilla JS for Firebase auth.

// If 'App.tsx' and Redux are for the actual game client and not the landing page,
// then this file (main.tsx) might not need to do anything for the landing page,
// as 'index.html' directly loads 'landing-page.ts'.

// However, if 'index.html' is intended to be the entry point for BOTH the static landing content
// AND a React app (e.g., the game itself loads into #root later, or parts of landing page are React),
// then we need to be careful.

// For now, assuming index.html is primarily static and landing-page.ts handles its interactivity.
// The React parts (App, Redux) seem to be for a different part of the application.

// If there's no React content on the landing page itself, this ReactDOM.render call might
// either be unnecessary or could even conflict if #root is also used by static content.
// Let's comment it out for now to ensure the static HTML and landing-page.ts work as intended.
// If React components are needed on this page, this needs to be re-evaluated.

/*
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
);
*/

console.log("main.tsx loaded. If this is for the static landing page, React rendering might be disabled intentionally.");
// The actual Firebase logic is in landing-page.ts and linked in index.html
// This file (main.tsx) as the entry point specified in index.html's <script type="module" src="/src/main.tsx">
// will execute. If it's not supposed to render React for the landing page, it can be minimal
// or handle other global setups if needed.

// For a pure static HTML + vanilla JS landing page, the script tag in index.html could point directly to landing-page.ts
// instead of main.tsx, and main.tsx + App.tsx + Redux would be for a different HTML entry point (e.g., game.html).
// Given the current setup, main.tsx IS loaded by index.html.
// We'll leave it as is, but the React rendering part is commented out.
