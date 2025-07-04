import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env);
  return {
    plugins: [react()],
    // define: { // This is one way to expose env variables, but Vite does VITE_ prefixed ones automatically
    //   'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
    //   // Add other Firebase env vars here if not using VITE_ prefix directly in code
    // }
    // Vite automatically makes VITE_ prefixed env variables available via import.meta.env
    // So, ensure your .env file variables are correctly prefixed (e.g., VITE_FIREBASE_API_KEY)
  }
})
