import * as dotenv from 'dotenv';
// Initialize dotenv. This will load .env file into process.env for backend context.
// In frontend (Vite), Vite handles .env files automatically for import.meta.env.
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') { // Avoid in prod if env vars are set by host
  dotenv.config();
}

// Import Firebase App and specific services
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
// import { getAnalytics, Analytics } from "firebase/analytics"; // If you plan to use Analytics

// Your web app's Firebase configuration
// These variables are loaded by Vite from .env files
// See: https://vitejs.dev/guide/env-and-mode.html

// Helper to get env variables, checking both import.meta.env (Vite) and process.env (Node)
const getEnvVar = (key: string): string | undefined => {
  // For Vite/frontend environment
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // For Node.js/backend environment (process.env is populated by dotenv or host)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'), // Optional
  databaseURL: getEnvVar('VITE_FIREBASE_DATABASE_URL'), // For Realtime Database
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let database: Database;
// let analytics: Analytics; // Optional

try {
  app = initializeApp(firebaseConfig);

  // Initialize and export Firebase services
  auth = getAuth(app);
  firestore = getFirestore(app);
  database = getDatabase(app); // Initialize Realtime Database
  // analytics = getAnalytics(app); // Optional: Initialize Analytics

  // @ts-ignore
  const isViteDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  // @ts-ignore
  const isNodeDev = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';


  if (isViteDev || isNodeDev) {
    console.log('Firebase SDK initialized successfully with config (some values may be hidden):', {
      apiKey: firebaseConfig.apiKey ? '***' : undefined,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      // etc. for other keys you want to log safely
    });
    // You might want to connect to emulators here if you're using them
    // import { connectAuthEmulator } from "firebase/auth";
    // connectAuthEmulator(auth, "http://localhost:9099");
  }

} catch (error) {
  console.error("Error initializing Firebase:", error);
  console.error("Received Firebase Config (some values may be hidden):", {
      apiKey: firebaseConfig.apiKey ? '***' : undefined,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
  }); // Log the config for debugging
  // Provide dummy objects or throw error to prevent app from running with broken Firebase
  // This is a simple fallback, a more robust app might handle this more gracefully
  app = {} as FirebaseApp; // Avoids further errors if app is used before proper init
  auth = {} as Auth;
  firestore = {} as Firestore;
  database = {} as Database;
  // analytics = {} as Analytics;

  // Depending on your error handling strategy, you might want to re-throw the error
  // or set a global flag indicating Firebase initialization failed.
  // @ts-ignore
  const isDevEnvironment = (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') || (typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined' && import.meta.env.DEV);
  if (isDevEnvironment) {
    console.error(`CRITICAL: Failed to initialize Firebase. Please check your .env file and Firebase project setup. \nError: ${error}\n\nAPI Key (from env): ${firebaseConfig.apiKey ? '***' : undefined}`);
  }
}


export { app, auth, firestore, database };
// export { app, auth, firestore, database, analytics }; // if using analytics
